export interface IEntity {
  id: number;
  name: string;
}

export interface IEntityCredentials {
  id?: number;
  name: string;
  description?: string;
}

export interface IEntityData {
  id: number;
  name: string;
  description: string | null;
}