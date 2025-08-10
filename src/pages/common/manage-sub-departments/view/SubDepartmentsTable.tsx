import {
  Button,
  NoDataMessage,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  Tooltip,
} from "../../../../components/ui";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import { truncateText } from "../../../../utils";
import { SubDepartment } from "../../../../interfaces";
import { useTranslation } from "react-i18next";
import { SUB_DEPARTMENT_NS } from "../../../../constants";
import { HasPermission } from "../../../../components/auth";

interface Props {
  subDepartments: SubDepartment[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const SubDepartmentsTable = ({
  subDepartments,
  isLoading,
  handleShow,
  handleEdit,
  handleDelete,
}: Props) => {
  const { t } = useTranslation([SUB_DEPARTMENT_NS]);

  const SUB_DEPARTMENT_TABLE_COLUMNS = [
    "table.columns.id",
    "table.columns.name",
    "table.columns.departmentName",
    "table.columns.entityName",
    "table.columns.description",
    "table.columns.actions",
  ];

  const columns = SUB_DEPARTMENT_TABLE_COLUMNS.map((key) => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton
          numberOfColumns={columns.length}
          defaultNumberOfRows={5}
        />
      ) : (
        <Table columns={columns}>
          {subDepartments.length == 0 ? (
            <NoDataMessage
              title={t("table.emptyTable.title")}
              message={t("table.emptyTable.message")}
            />
          ) : (
            subDepartments.map((subDepartment) => (
              <TableRow
                key={subDepartment.subDepartmentId}
                className="border-b"
              >
                <TableCell label={columns[0]}>
                  {subDepartment.subDepartmentId}
                </TableCell>
                <TableCell label={columns[1]}>{subDepartment.name}</TableCell>
                <TableCell label={columns[2]}>
                  {subDepartment.departmentName}
                </TableCell>
                <TableCell label={columns[3]}>
                  {subDepartment.entityName}
                </TableCell>
                <TableCell label={columns[4]}>
                  {subDepartment.description
                    ? truncateText(subDepartment.description, 30)
                    : t("NA")}
                </TableCell>
                <TableCell label={columns[5]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View SubDepartments">
                      <Tooltip content={t("buttons.toolTipShow")}>
                        <Button
                          variant="primary"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Eye className="w-full h-full" />}
                          aria-label={t("buttons.view")}
                          onClick={() =>
                            handleShow(subDepartment.subDepartmentId)
                          }
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Update SubDepartment">
                      <Tooltip content={t("buttons.toolTipEdit")}>
                        <Button
                          variant="info"
                          fullWidth={false}
                          size={"sm"}
                          icon={<FilePenLine className="w-full h-full" />}
                          aria-label={t("buttons.edit")}
                          onClick={() =>
                            handleEdit(subDepartment.subDepartmentId)
                          }
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Delete SubDepartment">
                      <Tooltip content={t("buttons.toolTipDelete")}>
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          aria-label={t("buttons.delete")}
                          onClick={() =>
                            handleDelete(subDepartment.subDepartmentId)
                          }
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

export default SubDepartmentsTable;
