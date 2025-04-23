export interface ILoggedInUser {
  token: string;
  id: string;
  role: string;
  rememberMe: boolean;
  permissions: string[];
}
