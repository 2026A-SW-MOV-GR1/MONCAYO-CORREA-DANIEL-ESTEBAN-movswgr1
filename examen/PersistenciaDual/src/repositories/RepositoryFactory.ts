import { IStorageRepository } from './IStorageRepository';
import { SQLiteRepository } from './SQLiteRepository';
import { AsyncStorageRepository } from './AsyncStorageRepository';
import logger from '../utils/logger';

export type StorageEngine = 'sqlite' | 'nosql';

let _sqliteRepo: SQLiteRepository | null = null;
let _asyncRepo: AsyncStorageRepository | null = null;

export async function getRepository(engine: StorageEngine): Promise<IStorageRepository> {
  logger.info(`RepositoryFactory: resolviendo engine="${engine}"`);

  if (engine === 'sqlite') {
    if (!_sqliteRepo) {
      logger.debug('RepositoryFactory: instanciando SQLiteRepository');
      _sqliteRepo = new SQLiteRepository();
      await _sqliteRepo.init();
    }
    return _sqliteRepo;
  }

  if (!_asyncRepo) {
    logger.debug('RepositoryFactory: instanciando AsyncStorageRepository');
    _asyncRepo = new AsyncStorageRepository();
  }
  return _asyncRepo;
}

export function resetFactory(): void {
  logger.debug('RepositoryFactory: reseteando instancias (uso en tests)');
  _sqliteRepo = null;
  _asyncRepo = null;
}
