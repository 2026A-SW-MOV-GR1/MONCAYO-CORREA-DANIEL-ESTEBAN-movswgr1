export interface Note {
  id: string;
  titulo: string;
  contenido: string;
  createdAt: number;
}

export interface IStorageRepository {
  getAll(): Promise<Note[]>;
  create(data: Pick<Note, 'titulo' | 'contenido'>): Promise<Note>;
  update(id: string, data: Partial<Pick<Note, 'titulo' | 'contenido'>>): Promise<void>;
  delete(id: string): Promise<void>;
}
