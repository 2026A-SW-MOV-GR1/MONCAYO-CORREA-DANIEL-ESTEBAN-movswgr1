/**
 * @jest-environment node
 *
 * Suite de Pruebas Unitarias — Persistencia Dual
 * Valida escritura correcta y conmutación de motor en las capas lógicas.
 */

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Mock de expo-sqlite (módulo nativo)
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

// Mock de AsyncStorage con almacén en memoria
jest.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};
  return {
    getItem:    jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
    setItem:    jest.fn((key: string, value: string) => { store[key] = value; return Promise.resolve(); }),
    removeItem: jest.fn((key: string) => { delete store[key]; return Promise.resolve(); }),
    __clearStore: () => { store = {}; },
  };
});

// ─── Imports (luego de los mocks) ─────────────────────────────────────────────
import { AsyncStorageRepository } from '../src/repositories/AsyncStorageRepository';
import { SQLiteRepository }       from '../src/repositories/SQLiteRepository';
import { getRepository, resetFactory } from '../src/repositories/RepositoryFactory';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Crea un mock completo de SQLiteDatabase para cada test de SQLite */
function buildMockDb(initialRows: object[] = []) {
  return {
    execAsync:   jest.fn().mockResolvedValue(undefined),
    runAsync:    jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
    getAllAsync:  jest.fn().mockResolvedValue(initialRows),
  };
}

// ─── Suite 1: AsyncStorageRepository ─────────────────────────────────────────

describe('AsyncStorageRepository', () => {
  let repo: AsyncStorageRepository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let AsyncStorage: any;

  beforeEach(() => {
    AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.__clearStore();
    jest.clearAllMocks();
    repo = new AsyncStorageRepository();
  });

  test('P1 — create() persiste una nota y getAll() la retorna', async () => {
    const nota = await repo.create({ titulo: 'Nota NoSQL', contenido: 'Almacenada en AsyncStorage' });

    expect(nota.id).toBeDefined();
    expect(nota.titulo).toBe('Nota NoSQL');
    expect(nota.createdAt).toBeGreaterThan(0);

    const todas = await repo.getAll();
    expect(todas).toHaveLength(1);
    expect(todas[0].id).toBe(nota.id);
    expect(todas[0].titulo).toBe('Nota NoSQL');
  });

  test('P2 — create() múltiple y getAll() retorna todas las notas ordenadas', async () => {
    await repo.create({ titulo: 'Primera', contenido: '...' });
    await repo.create({ titulo: 'Segunda', contenido: '...' });
    await repo.create({ titulo: 'Tercera', contenido: '...' });

    const todas = await repo.getAll();
    expect(todas).toHaveLength(3);
    // Deben estar en orden descendente por createdAt
    expect(todas[0].createdAt).toBeGreaterThanOrEqual(todas[1].createdAt);
    expect(todas[1].createdAt).toBeGreaterThanOrEqual(todas[2].createdAt);
  });

  test('P3 — update() modifica el título de una nota existente', async () => {
    const nota = await repo.create({ titulo: 'Original', contenido: 'contenido' });
    await repo.update(nota.id, { titulo: 'Modificada' });

    const todas = await repo.getAll();
    expect(todas[0].titulo).toBe('Modificada');
    expect(todas[0].contenido).toBe('contenido'); // contenido no cambia
  });

  test('P4 — delete() elimina la nota y no deja rastros', async () => {
    const n1 = await repo.create({ titulo: 'Nota A', contenido: '' });
    const n2 = await repo.create({ titulo: 'Nota B', contenido: '' });

    await repo.delete(n1.id);

    const todas = await repo.getAll();
    expect(todas).toHaveLength(1);
    expect(todas[0].id).toBe(n2.id);
  });
});

// ─── Suite 2: SQLiteRepository ────────────────────────────────────────────────

describe('SQLiteRepository', () => {
  let repo: SQLiteRepository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let SQLite: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDb: any;

  beforeEach(async () => {
    SQLite = require('expo-sqlite');
    jest.clearAllMocks();
    mockDb = buildMockDb();
    SQLite.openDatabaseAsync.mockResolvedValue(mockDb);

    repo = new SQLiteRepository();
    await repo.init();
  });

  test('P5 — init() ejecuta CREATE TABLE y crea el esquema', async () => {
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith('notas.db');
    expect(mockDb.execAsync).toHaveBeenCalledTimes(1);
    expect(mockDb.execAsync).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE IF NOT EXISTS notas')
    );
  });

  test('P6 — create() llama runAsync con INSERT y retorna nota con id', async () => {
    const nota = await repo.create({ titulo: 'SQLite Test', contenido: 'Motor relacional' });

    expect(nota.id).toBeDefined();
    expect(nota.titulo).toBe('SQLite Test');
    expect(nota.createdAt).toBeGreaterThan(0);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO notas'),
      expect.arrayContaining([nota.id, 'SQLite Test', 'Motor relacional', nota.createdAt])
    );
  });

  test('P7 — getAll() consulta la tabla y retorna las filas del mock', async () => {
    const fakeRows = [
      { id: 'a1', titulo: 'Recuperada', contenido: 'OK', createdAt: 1000 },
    ];
    mockDb.getAllAsync.mockResolvedValueOnce(fakeRows);

    const resultado = await repo.getAll();

    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM notas')
    );
    expect(resultado).toHaveLength(1);
    expect(resultado[0].titulo).toBe('Recuperada');
  });
});

// ─── Suite 3: RepositoryFactory — Conmutación de motor ───────────────────────

describe('RepositoryFactory — Conmutación de Motor', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let SQLite: any;

  beforeEach(() => {
    SQLite = require('expo-sqlite');
    jest.clearAllMocks();
    SQLite.openDatabaseAsync.mockResolvedValue(buildMockDb());
    resetFactory();
  });

  test('P8 — engine="sqlite" resuelve una instancia de SQLiteRepository', async () => {
    const repo = await getRepository('sqlite');
    expect(repo).toBeInstanceOf(SQLiteRepository);
  });

  test('P9 — engine="nosql" resuelve una instancia de AsyncStorageRepository', async () => {
    const repo = await getRepository('nosql');
    expect(repo).toBeInstanceOf(AsyncStorageRepository);
  });

  test('P10 — motores son instancias independientes (datos no se mezclan)', async () => {
    const sqlRepo   = await getRepository('sqlite');
    const nosqlRepo = await getRepository('nosql');

    expect(sqlRepo).not.toBe(nosqlRepo);
    expect(sqlRepo).toBeInstanceOf(SQLiteRepository);
    expect(nosqlRepo).toBeInstanceOf(AsyncStorageRepository);
  });

  test('P11 — factory retorna el mismo singleton por engine (no doble init)', async () => {
    const repo1 = await getRepository('sqlite');
    const repo2 = await getRepository('sqlite');
    expect(repo1).toBe(repo2);         // misma referencia
    expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1); // init solo una vez
  });
});
