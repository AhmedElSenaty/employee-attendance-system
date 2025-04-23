export { default as AddAdminPage } from "./AddAdmin"
export { default as EditAdminPage } from "./EditAdmin"
export { default as ManageAdminsPage } from "./ManageAdmins"

export const ADMIN_TRANSLATION_NAMESPACE = "adminPages";

export const ADMIN_TABLE_COLUMNS = [
  "manageAdminsPage.table.columns.username",
  "manageAdminsPage.table.columns.title",
  "manageAdminsPage.table.columns.email",
  "manageAdminsPage.table.columns.isBlocked",
  "manageAdminsPage.table.columns.createdAt",
  "manageAdminsPage.table.columns.actions",
]