import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui/Table";
import { Button } from "../../../../components/ui/Button";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import { TFunction } from "i18next";
import { IDeviceData } from "../../../../interfaces";
import { DEVICE_TABLE_COLUMNS, DEVICE_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";
import { Tooltip } from "../../../../components/ui/Tooltip";

interface IDevicesTableProps {
  devices: IDeviceData[];
  isLoading: boolean;
  t: TFunction;
  handleShowDevice: (id: number) => void;
  handleEditDevice: (id: number) => void;
  handleDeleteDevice: (id: number) => void;
}

const DevicesTable = ({ devices, t, isLoading, handleShowDevice, handleEditDevice, handleDeleteDevice }: IDevicesTableProps) => {
  const columns = useMemo(
    () => DEVICE_TABLE_COLUMNS.map(key => t(key, { ns: DEVICE_TRANSLATION_NAMESPACE })),
    [t]
  );

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {devices.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title", { ns: DEVICE_TRANSLATION_NAMESPACE })} message={t("table.emptyTable.message", { ns: DEVICE_TRANSLATION_NAMESPACE })} />
          ) : (
            devices.map((device) => (
              <TableRow key={device.id} className="border-b">
                <TableCell label={columns[0]}>{device.id}</TableCell>
                <TableCell label={columns[1]}>{device.device_name}</TableCell>
                <TableCell label={columns[2]}>{device.iP_Address}</TableCell>
                <TableCell label={columns[3]}>{device.port}</TableCell>
                <TableCell label={columns[4]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Devices">
                      <Button 
                        variant="primary" 
                        fullWidth={false}
                        size={"sm"}
                        icon={<Eye className="w-full h-full" />} 
                        aria-label={t("buttons.view")}
                        onClick={() => handleShowDevice(device.id)}
                      />
                    </HasPermission>
                    <HasPermission permission="Update Device">
                      <Button 
                        variant="info" 
                        fullWidth={false}
                        size={"sm"} 
                        icon={<FilePenLine className="w-full h-full" />} 
                        aria-label={t("buttons.edit")} 
                        onClick={() => handleEditDevice(device.id)}
                      />
                    </HasPermission>
                    <HasPermission permission="Delete Device">
                      <Tooltip 
                        content="Delete Device"
                      >
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          aria-label={t("buttons.delete")}
                          onClick={() => handleDeleteDevice(device.id)}
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
