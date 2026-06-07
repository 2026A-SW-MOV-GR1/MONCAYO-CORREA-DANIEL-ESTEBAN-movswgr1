import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IStorageRepository, Note } from '../repositories/IStorageRepository';
import { StorageEngine, getRepository } from '../repositories/RepositoryFactory';
import logger from '../utils/logger';

interface StorageContextValue {
  engine: StorageEngine;
  toggleEngine: () => void;
  notes: Note[];
  loading: boolean;
  createNote: (titulo: string, contenido: string) => Promise<void>;
  updateNote: (id: string, titulo: string, contenido: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const StorageContext = createContext<StorageContextValue | null>(null);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [engine, setEngine] = useState<StorageEngine>('sqlite');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const repoRef = useRef<IStorageRepository | null>(null);

  const refresh = useCallback(async (repo: IStorageRepository) => {
    const data = await repo.getAll();
    setNotes(data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getRepository(engine)
      .then(async (repo) => {
        if (cancelled) return;
        repoRef.current = repo;
        await refresh(repo);
      })
      .catch((e) => logger.error('StorageContext: error cargando repositorio', e))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [engine, refresh]);

  const toggleEngine = useCallback(() => {
    setEngine((prev) => {
      const next: StorageEngine = prev === 'sqlite' ? 'nosql' : 'sqlite';
      logger.info(`StorageContext: conmutando engine ${prev} → ${next}`);
      return next;
    });
  }, []);

  const createNote = useCallback(
    async (titulo: string, contenido: string) => {
      if (!repoRef.current) return;
      await repoRef.current.create({ titulo, contenido });
      await refresh(repoRef.current);
    },
    [refresh]
  );

  const updateNote = useCallback(
    async (id: string, titulo: string, contenido: string) => {
      if (!repoRef.current) return;
      await repoRef.current.update(id, { titulo, contenido });
      await refresh(repoRef.current);
    },
    [refresh]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      if (!repoRef.current) return;
      await repoRef.current.delete(id);
      await refresh(repoRef.current);
    },
    [refresh]
  );

  return (
    <StorageContext.Provider
      value={{ engine, toggleEngine, notes, loading, createNote, updateNote, deleteNote }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage(): StorageContextValue {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage debe usarse dentro de <StorageProvider>');
  return ctx;
}
