import * as SQLite from 'expo-sqlite';
import { IStorageRepository, Note } from './IStorageRepository';
import logger from '../utils/logger';

export class SQLiteRepository implements IStorageRepository {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    logger.debug('SQLiteRepository.init: abriendo base de datos');
    this.db = await SQLite.openDatabaseAsync('notas.db');
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS notas (
        id        TEXT    PRIMARY KEY NOT NULL,
        titulo    TEXT    NOT NULL,
        contenido TEXT    NOT NULL,
        createdAt INTEGER NOT NULL
      );
    `);
    logger.info('SQLiteRepository.init: tabla lista');
  }

  private ensureDb(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('SQLiteRepository no inicializado — llama init() primero');
    }
    return this.db;
  }

  async getAll(): Promise<Note[]> {
    logger.debug('SQLiteRepository.getAll: consultando');
    try {
      const rows = await this.ensureDb().getAllAsync<Note>(
        'SELECT * FROM notas ORDER BY createdAt DESC;'
      );
      logger.info(`SQLiteRepository.getAll: ${rows.length} nota(s) encontrada(s)`);
      return rows;
    } catch (e) {
      logger.error('SQLiteRepository.getAll: falló', e);
      throw e;
    }
  }

  async create(data: Pick<Note, 'titulo' | 'contenido'>): Promise<Note> {
    const note: Note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      titulo: data.titulo,
      contenido: data.contenido,
      createdAt: Date.now(),
    };
    logger.debug('SQLiteRepository.create: insertando nota', { id: note.id, titulo: note.titulo });
    try {
      await this.ensureDb().runAsync(
        'INSERT INTO notas (id, titulo, contenido, createdAt) VALUES (?, ?, ?, ?);',
        [note.id, note.titulo, note.contenido, note.createdAt]
      );
      logger.info('SQLiteRepository.create: éxito', { id: note.id });
      return note;
    } catch (e) {
      logger.error('SQLiteRepository.create: falló', e);
      throw e;
    }
  }

  async update(
    id: string,
    data: Partial<Pick<Note, 'titulo' | 'contenido'>>
  ): Promise<void> {
    logger.debug('SQLiteRepository.update: actualizando nota', { id, ...data });
    const fields = (Object.keys(data) as (keyof typeof data)[])
      .map((k) => `${k} = ?`)
      .join(', ');
    const values: (string | number | null)[] = [
      ...(Object.values(data) as (string | number | null)[]),
      id,
    ];
    try {
      await this.ensureDb().runAsync(
        `UPDATE notas SET ${fields} WHERE id = ?;`,
        values
      );
      logger.info('SQLiteRepository.update: éxito', { id });
    } catch (e) {
      logger.error('SQLiteRepository.update: falló', e);
      throw e;
    }
  }

  async delete(id: string): Promise<void> {
    logger.debug('SQLiteRepository.delete: eliminando nota', { id });
    try {
      await this.ensureDb().runAsync('DELETE FROM notas WHERE id = ?;', [id]);
      logger.info('SQLiteRepository.delete: éxito', { id });
    } catch (e) {
      logger.error('SQLiteRepository.delete: falló', e);
      throw e;
    }
  }
}
