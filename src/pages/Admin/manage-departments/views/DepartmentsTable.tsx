import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton, Button, Tooltip } from "../../../../components/ui";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import { formatValue, truncateText } from "../../../../utils";
import { Department } from "../../../../interfaces";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore } from "../../../../store/";
import { useTranslation } from "react-i18next";
import { DEPARTMENT_NS } from "../../../../constants";

interface Props {
  departments: Department[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const DepartmentsTable = ({ departments, isLoading, handleShow, handleEdit, handleDelete }: Props) => {
  const { t } = useTranslation([DEPARTMENT_NS]);
  const { language } = useLanguageStore();

  const DEPARTMENT_TABLE_COLUMNS = [
    "table.columns.id",
    "table.columns.name",
    "table.columns.description",
    "table.columns.actions",
  ]

  const columns = DEPARTMENT_TABLE_COLUMNS.map(key => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {departments.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title")} message={t("table.emptyTable.message")} />
          ): (

            departments.map((department) => (
              <TableRow key={department.id} className="border-b">
                <TableCell label={columns[0]}>{formatValue(department.id, language)}</TableCell>
                <TableCell label={columns[1]}>{department.name}</TableCell>
                <TableCell label={columns[2]}>{department.description != null ? truncateText(department.description, 30) : t("NA")}</TableCell>
                <TableCell label={columns[4]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Departments">
                      <Tooltip 
                        content={t("buttons.toolTipShow")}
                      >
                        <Button 
                          variant="primary" 
                          fullWidth={false}
                          size={"sm"}
                          icon={<Eye className="w-full h-full" />} 
                          onClick={() => handleShow(department.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Update Department">
                      <Tooltip 
                        content={t("buttons.toolTipEdit")}
                      >
                        <Button 
                          variant="info" 
                          fullWidth={false}
                          size={"sm"} 
                          icon={<FilePenLine className="w-full h-full" />} 
                          onClick={() => handleEdit(department.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Delete Department">
                      <Tooltip 
                        content={t("buttons.toolTipDelete")}
                      >
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          onClick={() => handleDelete(department.id)}
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
