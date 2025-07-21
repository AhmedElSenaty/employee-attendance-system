import {
  StatusBadge,
  Button,
  NoDataMessage,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  Tooltip,
} from "../../../../components/ui";
import {
  AlertTriangle,
  Ban,
  Calendar,
  CheckCircle,
  FilePenLine,
  FileSpreadsheet,
  Trash2,
  RefreshCcw,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";

import { EmployeeData } from "../../../../interfaces";
import { NavLink } from "react-router";
import { truncateText } from "../../../../utils";
import { HasPermission } from "../../../../components/auth";
import { useUserStore } from "../../../../store/";
import { EMPLOYEE_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";

interface Props {
  employees: EmployeeData[];
  isLoading: boolean;
  handleDelete: (id: string) => void;
  handleUnblock: (id: string) => void;
  handleChangeIncludedStatus: (id: string) => void;
  handleShowLeaveStats: (id: string) => void;
  handleResetPassword: (id: string) => void;
  isResettingPassword?: boolean; // ✅ Add this
  handleSupervision: (id: string) => void;
}

const EmployeesTable = ({
  employees,
  isLoading,
  handleDelete,
  handleUnblock,
  handleChangeIncludedStatus,
  handleShowLeaveStats,
  handleResetPassword,
  handleSupervision,
}: Props) => {
  const { t } = useTranslation([EMPLOYEE_NS]);

  const userRole = useUserStore((state) => state.role);

  const EMPLOYEE_TABLE_COLUMNS = [
    "table.columns.fullName",
    "table.columns.email",
    "table.columns.ssn",
    // "table.columns.phoneNumber",
    "table.columns.departmentName",
    "table.columns.subDepartmentName",
    "table.columns.status",
    // "table.columns.isExcludedFromReports",
    "table.columns.actions",
  ];

  const columns = EMPLOYEE_TABLE_COLUMNS.map((key) => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton
          numberOfColumns={columns.length}
          defaultNumberOfRows={5}
        />
      ) : (
        <Table columns={columns}>
          {employees.length == 0 ? (
            <NoDataMessage
              title={t("table.emptyTable.title")}
              message={t("table.emptyTable.message")}
            />
          ) : (
            employees.map(
              ({
                id,
                fullName,
                email,
                ssn,
                // phoneNumber,
                departmentName,
                subDepartmentName,
                isActive,
                isBlocked,
                isExcludedFromReports,
                isSupervisor,
              }: EmployeeData) => (
                <TableRow key={id} className="border-b">
                  <TableCell label={columns[0]}>
                    {truncateText(fullName, 20)}
                  </TableCell>
                  <TableCell label={columns[1]}>
                    {truncateText(email, 15)}
                  </TableCell>
                  <TableCell label={columns[2]}>{ssn}</TableCell>
                  {/* <TableCell label={columns[3]}>
                    {phoneNumber != null ? phoneNumber : t("NA")}
                  </TableCell> */}
                  <TableCell label={columns[4]}>
                    {truncateText(departmentName, 20)}
                  </TableCell>
                  <TableCell label={columns[5]}>
                    {truncateText(subDepartmentName, 20)}
                  </TableCell>
                  <TableCell label={columns[6]}>
                    <div className="h-fit flex flex-col gap-3 items-center justify-center">
                      <div className="block">
                        <StatusBadge
                          variant={isActive ? "success" : "warning"}
                          size="medium"
                          icon={
                            isActive ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <AlertTriangle className="w-4 h-4" />
                            )
                          }
                        >
                          {isActive
                            ? t("table.status.active")
                            : t("table.status.notActive")}
                        </StatusBadge>
                      </div>
                      <div className="block">
                        {isBlocked && (
                          <StatusBadge
                            variant="neutral"
                            size="medium"
                            icon={<AlertTriangle className="w-4 h-4" />}
                          >
                            {t("table.status.blocked")}
                          </StatusBadge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell label={columns[6]}>
                    <div className="h-fit flex flex-col gap-3 items-center justify-center">
                      <div className="block">
                        <StatusBadge
                          variant={!isExcludedFromReports ? "success" : "error"}
                          size="medium"
                          icon={
                            !isExcludedFromReports ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )
                          }
                        >
                          {!isExcludedFromReports
                            ? t("table.status.included")
                            : t("table.status.excluded")}
                        </StatusBadge>
                      </div>
                    </div>
                  </TableCell> */}
                  <TableCell label={columns[7]}>
                    <div className="flex flex-wrap gap-2">
                      <HasPermission permission="Update Employee">
                        <Tooltip content={t("buttons.editToolTip")}>
                          <NavLink to={`/${userRole}/edit-employee/${id}`}>
                            <Button
                              variant="info"
                              fullWidth={false}
                              size={"sm"}
                              icon={<FilePenLine className="w-full h-full" />}
                              aria-label={t("buttons.edit")}
                            />
                          </NavLink>
                        </Tooltip>
                      </HasPermission>
                      <HasPermission permission="Delete Employee">
                        <Tooltip content={t("buttons.deleteToolTip")}>
                          <Button
                            variant="danger"
                            fullWidth={false}
                            size={"sm"}
                            icon={<Trash2 className="w-full h-full" />}
                            aria-label={t("buttons.delete")}
                            onClick={() => handleDelete(id)}
                          />
                        </Tooltip>
                      </HasPermission>
                      <HasPermission permission="View Attendances">
                        <Tooltip content={t("buttons.calenderToolTip")}>
                          <NavLink
                            to={`/${userRole}/manage-employee/${id}/calender`}
                          >
                            <Button
                              variant="secondary"
                              fullWidth={false}
                              size={"sm"}
                              icon={<Calendar className="w-full h-full" />}
                            />
                          </NavLink>
                        </Tooltip>
                      </HasPermission>
                      <HasPermission permission="Unlock Account">
                        {isBlocked && (
                          <Tooltip content={t("buttons.unlockToolTip")}>
                            <Button
                              variant="black"
                              fullWidth={false}
                              size={"sm"}
                              icon={<Ban className="w-full h-full" />}
                              aria-label={t("buttons.delete")}
                              onClick={() => handleUnblock(id)}
                            />
                          </Tooltip>
                        )}
                      </HasPermission>

                      <HasPermission permission="Include/Exclude Employee from Reports">
                        <Tooltip
                          content={
                            isExcludedFromReports
                              ? t("buttons.includeInReports")
                              : t("buttons.excludeFromReports")
                          }
                        >
                          <Button
                            variant={
                              !isExcludedFromReports ? "success" : "secondary"
                            }
                            fullWidth={false}
                            size={"sm"}
                            icon={
                              !isExcludedFromReports ? (
                                <Eye className="w-full h-full" />
                              ) : (
                                <EyeOff className="w-full h-full" />
                              )
                            }
                            onClick={() => handleChangeIncludedStatus(id)}
                          />
                        </Tooltip>
                      </HasPermission>

                      {/*  */}

                      <HasPermission permission="Update Employee">
                        <Tooltip content={t("buttons.reset")}>
                          <Button
                            variant="warning"
                            fullWidth={false}
                            size={"sm"}
                            icon={<RefreshCcw className="w-full h-full" />}
                            onClick={() => handleResetPassword(id)}
                          />
                        </Tooltip>
                      </HasPermission>

                      <Tooltip content={t("buttons.leaveStatsToolTip")}>
                        <Button
                          variant="success"
                          fullWidth={false}
                          size="sm"
                          icon={<FileSpreadsheet className="w-full h-full" />}
                          onClick={() => handleShowLeaveStats(id)}
                        />
                      </Tooltip>

                      {/*  */}
                      <HasPermission permission="Make Employee Supervisor of Sub department">
                        <Tooltip
                          content={
                            isSupervisor
                              ? t("buttons.RemoveSupervisor")
                              : t("buttons.makeSupervisor")
                          }
                        >
                          <Button
                            variant={isSupervisor ? "success" : "cancel"}
                            fullWidth={false}
                            size={"sm"}
                            icon={<UserPlus className="w-full h-full" />}
                            onClick={() => handleSupervision(id)}
                          />
                        </Tooltip>
                      </HasPermission>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </Table>
      )}
    </>
  );
};

export default EmployeesTable;
