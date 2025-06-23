export interface Daydata {
    dayId: number,
    dayEnglishName: string,
    dayArabicName: string
}

export interface UpdateWorkingDays {
  employeeId: string,
  workingDays: number[]
}