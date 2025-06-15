import { Eye, FilePenLine, Trash2 } from "lucide-react";
import { IDeviceData } from "../../../../interfaces";
import { HasPermission } from "../../../../components/auth";
import { Button, NoDataMessage, Table, TableCell, TableRow, TableSkeleton, Tooltip } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { DEVICES_NS } from "../../../../constants";
import { formatValue } from "../../../../utils";
import { useLanguageStore } from "../../../../store";

interface IDevicesTableProps {
  devices: IDeviceData[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const DevicesTable = ({ devices, isLoading, handleShow, handleEdit, handleDelete }: IDevicesTableProps) => {
  const { t } = useTranslation([DEVICES_NS]);
  const { language } = useLanguageStore();

  const DEVICE_TABLE_COLUMNS = [
    "table.columns.id",
    "table.columns.device_name",
    "table.columns.ip_address",
    "table.columns.port",
    "table.columns.actions",
  ]

  const columns = DEVICE_TABLE_COLUMNS.map(key => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {devices.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title")} message={t("table.emptyTable.message")} />
          ) : (
            devices.map((device) => (
              <TableRow key={device.id} className="border-b">
                <TableCell label={columns[0]}>{formatValue(device.id, language)}</TableCell>
                <TableCell label={columns[1]}>{device.device_name}</TableCell>
                <TableCell label={columns[2]}>{device.iP_Address}</TableCell>
                <TableCell label={columns[3]}>{formatValue(device.port, language)}</TableCell>
                <TableCell label={columns[4]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Devices">
                      <Tooltip 
                        content={t("buttons.toolTipShow")}
                      >
                        <Button 
                          variant="primary" 
                          fullWidth={false}
                          size={"sm"}
                          icon={<Eye className="w-full h-full" />} 
                          aria-label={t("buttons.view")}
                          onClick={() => handleShow(device.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Update Device">
                      <Tooltip 
                        content={t("buttons.toolTipEdit")}
                      >
                        <Button 
                          variant="info" 
                          fullWidth={false}
                          size={"sm"} 
                          icon={<FilePenLine className="w-full h-full" />} 
                          aria-label={t("buttons.edit")} 
                          onClick={() => handleEdit(device.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Delete Device">
                      <Tooltip 
                        content={t("buttons.toolTipDelete")}
                      >
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          aria-label={t("buttons.delete")}
                          onClick={() => handleDelete(device.id)}
                        />
                      </Tooltip>
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

export default DevicesTable;
