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
