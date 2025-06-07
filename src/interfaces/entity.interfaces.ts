import { IMetadata } from "./metaDataInterface";

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

export interface UseGetAllEntitiesReturn {
  entities: IEntityData[];
  metadata: IMetadata;
  isEntitiesDataLoading: boolean;
  totalEntities: number
}

export interface UseGetEntityByIDReturn {
  entity: IEntityData;
  isEntityDataLoading: boolean;
}

export interface UseGetEntitiesListReturn {
  entitiesList: IEntity[];
  entitiesListIsLoading: boolean;
}