export interface Daydata {
  dayId: number;
  dayEnglishName: string;
  dayArabicName: string;
}

export interface UpdateWorkingDays {
  employeeId: string;
  workingDays: number[];
  restDays: number[];
  StartDate: string;
  EndDate: string | null;
  Description?: string | null;
}
