export interface ProfileSummary {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface ProfileCredentials {
  id?: string;
  nameEn?: string;
  nameAr: string;
  permissionsIds?: string[];
}

export interface ProfileData {
  id: string,
  nameEn: string,
  nameAr: string,
  createdAt: string,
  updatedAt: string,
  permissionsIds: string[]
}
