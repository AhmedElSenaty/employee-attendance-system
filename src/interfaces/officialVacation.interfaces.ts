// Reusable base interface for an official vacation
export interface BaseOfficialVacation {
  name: string;
  startDate: string;
  endDate: string;
}

// Minimal representation (e.g., for dropdowns or summaries)
export interface OfficialVacationSummary {
  id: number;
  name: string;
}

// Input payload for creation or update forms (partial base + optional id)
export interface OfficialVacationCredentials extends Partial<BaseOfficialVacation> {
  id?: number;
}

// Full entity returned from API or stored in DB
export interface OfficialVacation extends BaseOfficialVacation {
  id: number;
}
