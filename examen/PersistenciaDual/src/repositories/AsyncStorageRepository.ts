import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorageRepository, Note } from './IStorageRepository';
import logger from '../utils/logger';

const STORAGE_KEY = '@notas_nosql';

export class AsyncStorageRepository implements IStorageRepository {
  private async readAll(): Promise<Note[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  }

  private async writeAll(notes: Note[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  async getAll(): Promise<Note[]> {
    logger.debug('AsyncStorageRepository.getAll: leyendo almacenamiento');
    try {
      const notes = await this.readAll();
      const sorted = notes.sort((a, b) => b.createdAt - a.createdAt);
      logger.info(`AsyncStorageRepository.getAll: ${sorted.length} nota(s) encontrada(s)`);
      return sorted;
    } catch (e) {
      logger.error('AsyncStorageRepository.getAll: falló', e);
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
    logger.debug('AsyncStorageRepository.create: creando nota', { id: note.id, titulo: note.titulo });
    try {
      const notes = await this.readAll();
      notes.push(note);
      await this.writeAll(notes);
      logger.info('AsyncStorageRepository.create: éxito', { id: note.id });
      return note;
    } catch (e) {
      logger.error('AsyncStorageRepository.create: falló', e);
      throw e;
    }
  }

  async update(
    id: string,
    data: Partial<Pick<Note, 'titulo' | 'contenido'>>
  ): Promise<void> {
    logger.debug('AsyncStorageRepository.update: actualizando nota', { id, ...data });
    try {
      const notes = await this.readAll();
      const idx = notes.findIndex((n) => n.id === id);
      if (idx === -1) {
        logger.error('AsyncStorageRepository.update: nota no encontrada', { id });
        return;
      }
      notes[idx] = { ...notes[idx], ...data };
      await this.writeAll(notes);
      logger.info('AsyncStorageRepository.update: éxito', { id });
    } catch (e) {
      logger.error('AsyncStorageRepository.update: falló', e);
      throw e;
    }
  }

  async delete(id: string): Promise<void> {
    logger.debug('AsyncStorageRepository.delete: eliminando nota', { id });
    try {
      const notes = await this.readAll();
      const filtered = notes.filter((n) => n.id !== id);
      await this.writeAll(filtered);
      logger.info('AsyncStorageRepository.delete: éxito', { id });
    } catch (e) {
      logger.error('AsyncStorageRepository.delete: falló', e);
      throw e;
    }
  }
}
