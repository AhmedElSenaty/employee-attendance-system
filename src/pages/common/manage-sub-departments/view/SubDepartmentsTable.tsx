import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui/Table";
import { Button } from "../../../../components/ui/Button";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import { TFunction } from "i18next";
import { truncateText } from "../../../../utils";
import { ISubDepartmentData } from "../../../../interfaces";
import { SUB_DEPARTMENT_TABLE_COLUMNS, SUB_DEPARTMENT_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";

interface ISubDepartmentsTableProps {
  subDepartments: ISubDepartmentData[];
  isLoading: boolean;
  t: TFunction;
  handleShowSubDepartment: (id: number) => void;
  handleEditSubDepartment: (id: number) => void;
  handleDeleteSubDepartment: (id: number) => void;
}

const SubDepartmentsTable = ({ subDepartments, t, isLoading, handleShowSubDepartment, handleEditSubDepartment, handleDeleteSubDepartment }: ISubDepartmentsTableProps) => {

  const columns = useMemo(
    () => SUB_DEPARTMENT_TABLE_COLUMNS.map(key => t(key, { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })),
    [t]
  );


  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {subDepartments.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })} message={t("table.emptyTable.message", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })} />
          ) : (
            subDepartments.map((subDepartment) => (
              <TableRow key={subDepartment.subDepartmentId} className="border-b">
                <TableCell label={columns[0]}>{subDepartment.subDepartmentId}</TableCell>
                <TableCell label={columns[1]}>{subDepartment.name}</TableCell>
                <TableCell label={columns[2]}>{subDepartment.departmentName}</TableCell>
                <TableCell label={columns[3]}>{subDepartment.entityName}</TableCell>
                <TableCell label={columns[4]}>{subDepartment.description != null ? truncateText(subDepartment.description, 30) : t("table.NA")}</TableCell>
                <TableCell label={columns[5]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View SubDepartments">
                      <Button 
                        variant="primary" 
                        fullWidth={false}
                        size={"sm"}
                        icon={<Eye className="w-full h-full" />} 
                        aria-label={t("buttons.view")}
                        onClick={() => handleShowSubDepartment(subDepartment.subDepartmentId)}
                      />
                    </HasPermission>
                    <HasPermission permission="Update SubDepartment">
                      <Button 
                        variant="info" 
                        fullWidth={false}
                        size={"sm"}
                        icon={<FilePenLine className="w-full h-full" />} 
                        aria-label={t("buttons.edit")} 
                        onClick={() => handleEditSubDepartment(subDepartment.subDepartmentId)}
                      />
                    </HasPermission>
                    <HasPermission permission="Delete SubDepartment">
                      <Button
                        variant="danger"
                        fullWidth={false}
                        size={"sm"}
                        icon={<Trash2 className="w-full h-full" />}
                        aria-label={t("buttons.delete")}
                        onClick={() => handleDeleteSubDepartment(subDepartment.subDepartmentId)}
                      />
                    </HasPermission>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </Table>
      )}
    </>
  );
};

export default SubDepartmentsTable;
