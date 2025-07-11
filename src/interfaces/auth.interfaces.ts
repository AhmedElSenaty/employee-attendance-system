export interface ILoggedInUser {
  token: string;
  id: string;
  role: string;
  name: string;
  rememberMe: boolean;
  imageUrl: null | string;
  permissions: string[];
  departmentId: string;
}
