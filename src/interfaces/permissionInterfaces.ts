export interface IPermissionsData {
  id: string,
  nameEn: string,
  nameAr: string
}

export interface UseGetAllPermissionsReturn {
  permissions: IPermissionsData[];
  isPermissionsDataLoading: boolean;
  totalPermissions: number
}