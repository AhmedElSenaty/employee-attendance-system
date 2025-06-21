// Reusable base interface
export interface BaseEntity {
  name: string;
  description?: string | null;
}

// Minimal entity representation (e.g., for dropdowns or lists)
export interface EntitySummary {
  id: number;
  name: string;
}

// Entity credentials input (e.g., for forms or creation DTO)
export interface EntityCredentials extends Partial<BaseEntity> {
  id?: number;
}

// Full entity from API or DB
export interface Entity extends BaseEntity {
  id: number;
  description: string | null; // explicitly normalized to ensure null for empty
}
