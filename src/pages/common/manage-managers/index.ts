export { default as ManageManagersPage } from "./ManageManagers"
export { default as AddManagerPage } from "./AddManager"
export { default as EditManagerPage } from "./EditManager"

export const MANAGER_TRANSLATION_NAMESPACE = "managerPages";

export const MANAGER_TABLE_COLUMNS = [
  "manageManagersPage.table.columns.username",
  "manageManagersPage.table.columns.email",
  "manageManagersPage.table.columns.department",
  "manageManagersPage.table.columns.status",
  "manageManagersPage.table.columns.createdAt",
  "manageManagersPage.table.columns.actions",
]

export const MANAGER_HOVER_OFFSET = 5;

export const MANAGER_GRAPH_LABEL_KEYS = [
  "manageManagersPage.graph.labels.active",
  "manageManagersPage.graph.labels.locked",
  "manageManagersPage.graph.labels.blocked",
];

export const MANAGER_GRAPH_BACKGROUND_COLORS = [
  "#10B981",
  "#F59E0B",
  "#000000",
];