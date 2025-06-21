// Reusable base interface
export interface BaseDepartment {
  name: string;
  description?: string | null;
}

// Minimal department representation (e.g., for dropdowns or summaries)
export interface DepartmentSummary {
  id: number;
  name: string;
}

// Department credentials input (e.g., for form data or creation DTO)
export interface DepartmentCredentials extends Partial<BaseDepartment> {
  id?: number;
}

// Full department entity from API or DB
export interface Department extends BaseDepartment {
  id: number;
  description: string | null;
}
