import { Table, TableCell, TableRow, TableSkeleton, NoDataMessage, StatusBadge } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { DEVICES_NS } from "../../../../constants";
import { DisconnectedDevice } from "../../../../interfaces";

interface Props {
  devices: DisconnectedDevice[];
  isLoading: boolean;
}

const DisconnectedDevicesTable = ({ devices, isLoading }: Props) => {
  const { t } = useTranslation([DEVICES_NS]);

  const columns = [
    t("table.columns.time"),
    t("table.columns.date"),
    t("table.columns.ip"),
    t("table.columns.status"),
  ];

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {devices.length === 0 ? (
            <NoDataMessage
              title={t("table.emptyTable.title")}
              message={t("table.emptyTable.message")}
            />
          ) : (
            devices.map((device, idx) => (
              <TableRow key={idx} className="border-b">
                <TableCell label={columns[0]}>{device.time}</TableCell>
                <TableCell label={columns[1]}>{device.date}</TableCell>
                <TableCell label={columns[2]}>{device.ip}</TableCell>
                <TableCell label={columns[3]}>
                  <StatusBadge variant={"error"}>{device.status}</StatusBadge>
                </TableCell>
              </TableRow>
            ))
          )}
        </Table>
      )}
    </>
  );
};

export default DisconnectedDevicesTable;
