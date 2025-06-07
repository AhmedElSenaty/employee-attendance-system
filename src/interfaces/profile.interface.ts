import { IMetadata } from "./metaDataInterface";

export interface IProfile {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface IProfileCredentials {
  id?: string;
  nameEn?: string;
  nameAr: string;
  permissionsIds?: string[];
}

export interface IProfileData {
  id: string,
  nameEn: string,
  nameAr: string,
  createdAt: string,
  updatedAt: string,
  permissionsIds: string[]
}

export interface UseGetAllProfilesReturn {
  profiles: IProfileData[];
  metadata: IMetadata;
  isProfilesDataLoading: boolean;
  totalProfiles: number
}

export interface UseGetProfileByIDReturn {
  profile: IProfileData;
  isProfileDataLoading: boolean;
}

export interface UseGetProfilesListReturn {
  profilesList: IProfile[]; // Assuming `Profile` is your model type
  profilesListIsLoading: boolean;
}

export interface UseGetProfilePermissionsReturn {
  profilePermissions: string[]; // Assuming `Permission` is your model type
  profilePermissionsIsLoading: boolean;
}