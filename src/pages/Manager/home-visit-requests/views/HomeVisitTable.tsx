import { Eye, Trash, ArrowLeftRight, FilePen } from "lucide-react";
import {
  Button,
  NoDataMessage,
  StatusBadge,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  Tooltip,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../store/language.store";
import { getRequestStatusVariant } from "../../../../utils";
import { HOME_VISIT_REQUESTS_NS } from "../../../../constants";
import { HomeVisitDetails } from "../../../../interfaces/HomeVisit.interfaces";

interface Props {
  requests: HomeVisitDetails[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
  handleChange: (id: number) => void;
}

const HomeVisitTable = ({
  requests,
  isLoading,
  handleShow,
  handleDelete,
  handleEdit,
  handleChange,
}: Props) => {
  const { t } = useTranslation(HOME_VISIT_REQUESTS_NS);
  const { language } = useLanguageStore();

  const TABLE_COLUMNS = [
    "table.columns.employeeName",
    "table.columns.startDate",
    "table.columns.endDate",
    "table.columns.requestedAt",
    "table.columns.status",
    "table.columns.actions",
  ];

  const columns = TABLE_COLUMNS.map((key) => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton
          numberOfColumns={columns.length}
          defaultNumberOfRows={5}
        />
      ) : (
        <Table columns={columns}>
          {requests.length == 0 ? (
            <NoDataMessage
              title={t("table.emptyTable.title")}
              message={t("table.emptyTable.message")}
            />
          ) : (
            requests.map((request) => (
              <TableRow key={request.id} className="border-b">
                <TableCell label={columns[0]}>{request.employeeName}</TableCell>
                <TableCell label={columns[1]}>
                  {new Date(request.startDate || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[2]}>
                  {new Date(request.endDate || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[3]}>
                  {new Date(request?.requestedAt || "").toLocaleString(
                    language === "ar" ? "ar-EG" : "en-CA",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </TableCell>
                <TableCell label={columns[4]}>
                  <StatusBadge
                    variant={getRequestStatusVariant(request.status)}
                    size="medium"
                    shape="rounded"
                  >
                    {t(`status.${request.status as number}`)}
                  </StatusBadge>
                </TableCell>
                <TableCell label={columns[5]}>
                  <div className="flex flex-wrap gap-2">
                    <Tooltip content={t("table.buttons.toolTipShow")}>
                      <Button
                        variant="primary"
                        fullWidth={false}
                        size={"sm"}
                        icon={<Eye className="w-full h-full" />}
                        onClick={() => handleShow(request.id)}
                      />
                    </Tooltip>
                    <Tooltip content={t("table.buttons.toolTipDelete")}>
                      <Button
                        variant="error"
                        fullWidth={false}
                        size={"sm"}
                        icon={<Trash className="w-full h-full" />}
                        onClick={() => handleDelete(request.id)}
                      />
                    </Tooltip>
                    <Tooltip content={t("table.buttons.toolTipEdit")}>
                      <Button
                        variant="info"
                        fullWidth={false}
                        size={"sm"}
                        icon={<FilePen className="w-full h-full" />}
                        onClick={() => handleEdit(request.id)}
                      />
                    </Tooltip>
                    <Tooltip content={t("table.buttons.toolTipChange")}>
                      <Button
                        variant="warning"
                        fullWidth={false}
                        size={"sm"}
                        icon={<ArrowLeftRight className="w-full h-full" />}
                        onClick={() => handleChange(request.id)}
                      />
                    </Tooltip>
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

export default HomeVisitTable;
