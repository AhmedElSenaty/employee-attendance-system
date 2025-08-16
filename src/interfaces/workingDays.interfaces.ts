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

export interface EmployeeWorkingSchedule {
  startDate: string;
  endDate: string;
  "1": string; // Monday
  "2": string; // Tuesday
  "3": string; // Wednesday
  "4": string; // Thursday
  "5": string; // Friday
  "6": string; // Saturday
  "7": string; // Sunday
}

export interface EmployeeWorkingScheduleCredentials {
  employeeId: string;
  scheduleData: EmployeeWorkingSchedule[];
}
