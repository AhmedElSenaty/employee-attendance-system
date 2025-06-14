export interface IDepartment {
  id: number;
  name: string;
}

export interface IDepartmentCredentials {
  id: number;
  name: string;
  description?: string;
}

export interface IDepartmentFieldConfig {
  label?: string;
  name: "id" | "name" | "description";
  type: string;
}

export interface IDepartmentData {
  id: number;
  name: string;
  description: string;
}
