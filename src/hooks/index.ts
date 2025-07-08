export * from "./URLSearchParams.hook"
export * from "./account.hook"
export * from "./auth.hooks"
export * from "./debounce.hook"
export * from "./me.hooks"
export * from "./workingDays.hooks"
export * from "./leaveRequest.hook"
export * from "./ordinaryRequest.hooks"
export * from "./casualLeaveRequest.hooks"
export * from "./sickRequest.hooks"
export * from "./missionRequest.hooks"

export * from "./systemData.hooks"
export * from "./device.hooks"
export * from "./log.hooks"
export * from "./profile.hooks"
export * from "./permission.hooks"
export * from "./officialVacation.hooks"
export * from "./entity.hooks"
export * from "./department.hooks"
export * from "./subDepartment.hooks"
export * from "./attendance.hooks"
export * from "./report.hooks"
export * from "./employee.hooks"
export * from "./manager.hooks"
export * from "./admin.hooks"


export interface INotification {
    deptId: number
    message: string
    time: string
}