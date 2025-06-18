export interface IDaydata {
    dayId: number,
    dayEnglishName: string,
    dayArabicName: string
}

export interface IUpdateWorkingDays {
  employeeId: string,
  workingDays: number[]
}