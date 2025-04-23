export interface IResetAccountCredentials {
  email: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface IResetAccountFieldConfig {
  label?: string;
  name: "email" | "oldPassword" | "password" | "confirmPassword";
  type: string;
}