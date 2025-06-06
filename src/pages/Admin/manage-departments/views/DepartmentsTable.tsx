import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton, Button, Tooltip } from "../../../../components/ui";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import { TFunction } from "i18next";
import { formatValue, truncateText } from "../../../../utils";
import { IDepartmentData } from "../../../../interfaces";
import { DEPARTMENT_TABLE_COLUMNS, DEPARTMENT_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore } from "../../../../store/language.store";

interface IDepartmentsTableProps {
  departments: IDepartmentData[];
  isLoading: boolean;
  t: TFunction;
  handleShowDepartment: (id: number) => void;
  handleEditDepartment: (id: number) => void;
  handleDeleteDepartment: (id: number) => void;
}

const DepartmentsTable = ({ departments, t, isLoading, handleShowDepartment, handleEditDepartment, handleDeleteDepartment }: IDepartmentsTableProps) => {
    const { language } = useLanguageStore();

  const columns = useMemo(
    () => DEPARTMENT_TABLE_COLUMNS.map(key => t(key, { ns: DEPARTMENT_TRANSLATION_NAMESPACE })),
    [t]
  );

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {departments.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })} message={t("table.emptyTable.message", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })} />
          ): (

            departments.map((department) => (
              <TableRow key={department.id} className="border-b">
                <TableCell label={columns[0]}>{formatValue(department.id, language)}</TableCell>
                <TableCell label={columns[1]}>{department.name}</TableCell>
                <TableCell label={columns[2]}>{department.description != null ? truncateText(department.description, 30) : t("table.NA")}</TableCell>
                <TableCell label={columns[4]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Departments">
                      <Tooltip content="View Departments">
                        <Button 
                          variant="primary" 
                          fullWidth={false}
                          size={"sm"}
                          icon={<Eye className="w-full h-full" />} 
                          aria-label={t("buttons.view")}
                          onClick={() => handleShowDepartment(department.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Update Department">
                      <Tooltip content="Update Department">
                        <Button 
                          variant="info" 
                          fullWidth={false}
                          size={"sm"} 
                          icon={<FilePenLine className="w-full h-full" />} 
                          aria-label={t("buttons.edit")} 
                          onClick={() => handleEditDepartment(department.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Delete Department">
                      <Tooltip content="Delete Department">
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          aria-label={t("buttons.delete")}
                          onClick={() => handleDeleteDepartment(department.id)}
                        />
                      </Tooltip>
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

export default DepartmentsTable;
