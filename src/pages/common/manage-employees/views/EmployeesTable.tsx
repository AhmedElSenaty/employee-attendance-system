import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui/Table";
import { Button } from "../../../../components/ui/Button";
import { AlertTriangle, Ban, Calendar, CheckCircle, FilePenLine, Trash2 } from "lucide-react";
import { TFunction } from "i18next";
import { IEmployeeData } from "../../../../interfaces";
import { NavLink } from "react-router";
import { StatusBadge } from "../../../../components/ui/StatusBadge";
import { truncateText } from "../../../../utils";
import { EMPLOYEE_TABLE_COLUMNS, EMPLOYEE_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";
import { useUserStore } from "../../../../store/user.store";

interface IEmployeesTableProps {
  employees: IEmployeeData[];
  isLoading: boolean;
  t: TFunction;
  handleDeleteEmployee: (id: string) => void;
  handleUnblockEmployee: (id: string) => void;
}

const EmployeesTable = ({ employees, t, isLoading, handleDeleteEmployee, handleUnblockEmployee }: IEmployeesTableProps) => {
  const userRole = useUserStore((state) => state.role);

  const columns = useMemo(
    () => EMPLOYEE_TABLE_COLUMNS.map(key => t(key, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })),
    [t]
  );

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {employees.length == 0 ? (
            <NoDataMessage title={t("manageEmployeesPage.table.emptyTable.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} message={t("manageEmployeesPage.table.emptyTable.message", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} />
          ) : (
            employees.map(({ id, fullName, email, ssn, phoneNumber, departmentName, subDepartmentName, isActive, isBlocked }: IEmployeeData) => (
              <TableRow key={id} className="border-b">
                <TableCell label={columns[0]}>{truncateText(fullName, 20)}</TableCell>
                <TableCell label={columns[1]}>
                  {truncateText(email, 20)}
                </TableCell>
                <TableCell label={columns[2]}>{ssn}</TableCell>
                <TableCell label={columns[3]}>{phoneNumber != null ? phoneNumber : t("table.NA")}</TableCell>
                <TableCell label={columns[4]}>{truncateText(departmentName, 20)}</TableCell>
                <TableCell label={columns[5]}>{truncateText(subDepartmentName, 20)}</TableCell>
                <TableCell label={columns[6]}>
                  <div className="h-fit flex flex-col gap-3 items-center justify-center">
                    <div className="block">
                      <StatusBadge
                        variant={isActive ? "success" : "warning"}
                        size="medium"
                        icon={isActive ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      >
                        {isActive
                          ? t("manageEmployeesPage.table.status.active", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })
                          : t("manageEmployeesPage.table.status.notActive", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
                      </StatusBadge>
                    </div>
                    <div className="block">
                      {isBlocked && (
                        <StatusBadge
                          variant="neutral"
                          size="medium"
                          icon={<AlertTriangle className="w-4 h-4" />}
                        >
                          {t("manageEmployeesPage.table.status.blocked", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
                        </StatusBadge>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell label={columns[7]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="Update Employee">
                      <NavLink to={`/${userRole}/edit-employee/${id}`}>
                        <Button 
                          variant="info" 
                          fullWidth={false}
                          size={"sm"} 
                          icon={<FilePenLine className="w-full h-full" />} 
                          aria-label={t("buttons.edit")} 
                        />
                      </NavLink>
                    </HasPermission>
                    <HasPermission permission="Delete Employee">
                      <Button
                        variant="danger"
                        fullWidth={false}
                        size={"sm"}
                        icon={<Trash2 className="w-full h-full" />}
                        aria-label={t("buttons.delete")}
                        onClick={() => handleDeleteEmployee(id)}
                      />
                    </HasPermission>
                    <HasPermission permission="View Attendances">
                      <NavLink to={`/${userRole}/manage-employee/${id}/calender`}>
                        <Button
                          variant="secondary"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Calendar className="w-full h-full" />}
                        />
                      </NavLink>
                    </HasPermission>
                    <HasPermission permission="Unlock Account">
                      {isBlocked &&
                        <Button
                          variant="black"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Ban className="w-full h-full" />}
                          aria-label={t("buttons.delete")}
                          onClick={() => handleUnblockEmployee(id)}
                        />
                      }
                    </HasPermission>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )
          }
        </Table>
      )}
    </>
  );
};

export default EmployeesTable;
