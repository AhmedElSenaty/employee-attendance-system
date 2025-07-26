import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  NoDataMessage,
  StatusBadge,
} from "../../../../components/ui";
import { DEVICES_NS } from "../../../../constants";
import { DisconnectedDevice } from "../../../../interfaces";

const DisconnectedDevicesTable = () => {
  const { t } = useTranslation([DEVICES_NS]);
  const [devices, setDevices] = useState<DisconnectedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:2000/");
    socketRef.current = socket;

    socket.onopen = () => {
      setIsLoading(false);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // If receiving single device at a time
        setDevices((prev) => {
          const filtered = prev.filter((device) => device.IP !== data.data.IP);

          return [...filtered, data.data].reverse();
        });

        // If receiving array of devices instead, use this instead:
        // setDevices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("WebSocket message parse error:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.warn("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  const columns = [
    t("table.columns.time"),
    t("table.columns.date"),
    t("table.columns.ip"),
    t("table.columns.status"),
  ];

  return (
    <>
      {isLoading ? (
        <TableSkeleton
          numberOfColumns={columns.length}
          defaultNumberOfRows={5}
        />
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
                <TableCell label={columns[0]}>{device.Time}</TableCell>
                <TableCell label={columns[1]}>{device.Date}</TableCell>
                <TableCell label={columns[2]}>{device.IP}</TableCell>
                <TableCell label={columns[3]}>
                  <StatusBadge
                    variant={
                      device.Status === "Disconnected" ? "error" : "success"
                    }
                  >
                    {device.Status}
                  </StatusBadge>
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
