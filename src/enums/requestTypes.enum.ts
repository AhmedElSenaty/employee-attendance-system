export enum LeaveType {
  Ordinary = 2,
  Casual = 3,
  MorningLeave = 4,
  EveningLeave = 5,
  FullDayMission = 6,
  HalfDayMission = 7,
}

export enum AllLeaveType {
  Sick = 1, // مرضي
  Ordinary = 2, // اعتيادي
  Casual = 3, // عارضه
  MorningLeave = 4, // إذن صباحي
  EveningLeave = 5, // إذن مسائي
  FullDayMission = 6, // مأموريه يوم
  HalfDayMission = 7, // مأمورية نصف يوم
  Generic = 8, // طلب مخصص
  HomeVisit = 9, // زيارة منزلية
}
