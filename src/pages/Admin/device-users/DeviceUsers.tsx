import { useTranslation } from "react-i18next";
import {
  Button,
  Header,
  NoDataMessage,
  Paginator,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  Tooltip,
} from "../../../components/ui";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useDebounce, useGetDeviceUsers, useToggleRole } from "../../../hooks";
import Filters from "./views/Filters";
import { RefreshCcw } from "lucide-react";
import { HasPermission } from "../../../components/auth";

const DeviceUsers = () => {
  const { t } = useTranslation("deviceUsers");
  const { getParam, setParam, clearParams } = useURLSearchParams();
  // Using the enhanced getParam with parser support from the improved hook
  const rawPage = getParam("page", Number);
  const rawPageSize = getParam("pageSize", Number);
  const rawSearchKey = getParam("searchKey");
  const rawSearchQuery = useDebounce(getParam("searchQuery"), 650);

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;

  const { deviceUsers, isLoading, metadata, refetch } = useGetDeviceUsers(
    page,
    pageSize,
    searchKey,
    searchQuery
  );

  const { mutate: toggleRole } = useToggleRole();

  const handleToggleRole = (deviceUser) => {
    const newRole = deviceUser.role === 14 ? 0 : 14;

    toggleRole(
      {
        ip: deviceUser.deviceIP,
        uid: deviceUser.uid,
        employeeID: deviceUser.employeeId,
        newRole: newRole,
        name: deviceUser.employeeName,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };
  const DeviceUsers_TABLE_COLUMNS = [
    "table.columns.employeeId",
    "table.columns.employeeName",
    "table.columns.role",
    "table.columns.uid",
    "table.columns.deviceName",
    "table.columns.deviceIP",
    "table.columns.actions",
  ];

  const columns = DeviceUsers_TABLE_COLUMNS.map((key) => t(key));

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <Filters
              searchBy={metadata.searchBy}
              getParam={getParam}
              setParam={setParam}
              clearParams={clearParams}
            />
          </div>

          <div className="w-full overflow-x-auto">
            {isLoading ? (
              <TableSkeleton
                numberOfColumns={columns.length}
                defaultNumberOfRows={5}
              />
            ) : (
              <Table columns={columns}>
                {deviceUsers.length === 0 ? (
                  <NoDataMessage
                    title={t("table.emptyTable.title")}
                    message={t("table.emptyTable.message")}
                  />
                ) : (
                  deviceUsers.map((deviceUser) => (
                    <TableRow key={deviceUser.id} className="border-b">
                      <TableCell label={columns[0]}>
                        {deviceUser.employeeId}
                      </TableCell>

                      <TableCell label={columns[1]}>
                        {deviceUser.employeeName}
                      </TableCell>

                      <TableCell label={columns[2]}>
                        {t(`status.${deviceUser.role}`)}
                      </TableCell>

                      <TableCell label={columns[3]}>{deviceUser.uid}</TableCell>

                      <TableCell label={columns[4]}>
                        {deviceUser.deviceName}
                      </TableCell>

                      <TableCell label={columns[5]}>
                        {deviceUser.deviceIP}
                      </TableCell>
                      <TableCell label={columns[5]}>
                        <div className="flex flex-wrap gap-2">
                          <HasPermission permission="Toggle Device User Role">
                            <Tooltip
                              content={
                                deviceUser.role == 14
                                  ? t("switchRoleToUser")
                                  : t("switchRoleToAdmin")
                              }
                            >
                              <Button
                                variant="info"
                                size="sm"
                                fullWidth={false}
                                icon={<RefreshCcw className="w-4 h-4" />}
                                onClick={() => handleToggleRole(deviceUser)}
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
          </div>
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isLoading}
            onClickFirst={() => setParam("page", String(1))}
            onClickPrev={() =>
              setParam(
                "page",
                String(Math.max((Number(getParam("page")) || 1) - 1, 1))
              )
            }
            onClickNext={() =>
              setParam(
                "page",
                String(
                  Math.min(
                    (Number(getParam("page")) || 1) + 1,
                    metadata?.pagination?.totalPages || 1
                  )
                )
              )
            }
          />
        </div>
      </div>
    </>
  );
};
export default DeviceUsers;
