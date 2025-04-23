export { default as ManageEmployeesPage } from "./ManageEmployees"
export { default as AddEmployeePage } from "./AddEmployee"
export { default as EditEmployeePage } from "./EditEmployee"

export const EMPLOYEE_TRANSLATION_NAMESPACE = "employeePages";

export const EMPLOYEE_TABLE_COLUMNS = [
  "manageEmployeesPage.table.columns.fullName",
  "manageEmployeesPage.table.columns.email",
  "manageEmployeesPage.table.columns.ssn",
  "manageEmployeesPage.table.columns.phoneNumber",
  "manageEmployeesPage.table.columns.departmentName",
  "manageEmployeesPage.table.columns.subDepartmentName",
  "manageEmployeesPage.table.columns.status",
  "manageEmployeesPage.table.columns.actions",
]

export const EMPLOYEE_BORDER_WIDTH = 2;

export const EMPLOYEE_GRAPH_LABEL_KEYS = [
  "manageEmployeesPage.graph.labels.active",
  "manageEmployeesPage.graph.labels.deactivated",
  "manageEmployeesPage.graph.labels.locked",
  "manageEmployeesPage.graph.labels.blocked",
];

export const EMPLOYEE_GRAPH_BACKGROUND_COLORS = [
  "#33FF57",
  "#FFAA33",
  "#3357FF",
  "#FF3370",
];

export const EMPLOYEE_GRAPH_BORDER_COLORS = [
  "#27AE60",
  "#E67E22",
  "#2980B9",
  "#D81B60",
];