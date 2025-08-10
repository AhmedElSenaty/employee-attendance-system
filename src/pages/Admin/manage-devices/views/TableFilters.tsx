import { formatValue } from "../../../../utils";
import { RefreshCcw, Search } from "lucide-react";
import { useLanguageStore } from "../../../../store/";
import {
  Button,
  CustomSelect,
  Field,
  Input,
  Label,
  SelectBoxSkeleton,
  Tooltip,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { DEVICES_NS } from "../../../../constants";
import { useGetDevicesList } from "../../../../hooks";
import { DeviceSummary } from "../../../../interfaces";
import { useSearchParams } from "react-router";

interface Props {
  searchBy: string[];
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
}

const TableFilters = ({ searchBy, getParam, setParam, clearParams }: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation([DEVICES_NS]);

  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: Record<string, string>) => {
    for (const key in params) {
      searchParams.set(key, params[key]);
    }
    setSearchParams(searchParams);
  };

  const { devices: devicesList, isLoading: devicesListIsLoading } =
    useGetDevicesList();

  const deviceOptions =
    devicesList?.map((device: DeviceSummary) => ({
      value: device.name,
      label: device.name,
    })) || [];

  const pageSizeOptions = [10, 20, 30, 40, 50].map((size) => ({
    value: size,
    label: formatValue(size, language),
  }));

  const selectedPageSizeValue = pageSizeOptions.find(
    (opt) =>
      opt.value === (getParam("pageSize") ? Number(getParam("pageSize")) : 10)
  );

  const searchByOptions = searchBy.map((search) => ({
    value: search || "",
    label: t(`filters.searchBy.${String(search)}`) ?? "",
  }));

  const selectedSearchByValue = searchByOptions.find(
    (opt) => opt.value === (getParam("searchKey") ? getParam("searchKey") : "")
  );

  return (
    <>
      <div className="w-full flex flex-wrap items-end gap-4">
        <Field className="flex flex-col space-y-2 w-fit">
          <Label>{t("filters.pageSize")}</Label>
          <CustomSelect
            options={pageSizeOptions}
            value={selectedPageSizeValue}
            onChange={(option) =>
              setParam("pageSize", String(option?.value ?? 10))
            }
            className="w-25"
          />
        </Field>

        {/* Search Type */}
        <Field className="flex flex-col space-y-2">
          <Label size="md">{t("filters.searchBy.label")} </Label>
          <CustomSelect
          placeholder={t("filters.select.label")}
            options={searchByOptions}
            value={selectedSearchByValue}
            onChange={(option) => setParam("searchKey", String(option?.value))}
            isSearchable
          />
        </Field>

        {/* Search Input */}
        <Field className="flex-grow min-w-[200px] flex flex-col space-y-2">
          <Label size="md">{t("filters.search.label")}</Label>
          <Input
            placeholder={t("filters.search.placeholder")}
            icon={<Search size={18} className="text-gray-500" />}
            value={getParam("searchQuery") ?? ""}
            onChange={(e) => setParam("searchQuery", e.target.value)}
          />
        </Field>

        {/* Device ID */}
        <Field className="space-y-2 w-[300px]">
          <Label size="lg">{t("filters.searchBy.SearchByDeviceName")}</Label>
          {devicesListIsLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              className="w-full"
              placeholder={t("filters.select.label")}
              options={deviceOptions}
              value={
                getParam("searchKey") === "SearchByDeviceName"
                  ? deviceOptions.find(
                      (opt) => opt.value === getParam("searchQuery")
                    ) || null
                  : null
              }
              onChange={(option) => {
                const name = String(option?.value ?? "");
                setSearchParams({
                  searchKey: "SearchByDeviceName",
                  searchQuery: name,
                });
              }}
              isSearchable
              isClearable
            />
          )}
        </Field>

        <Tooltip content={t("filters.toolTipResetFilters")}>
          <Button onClick={clearParams} icon={<RefreshCcw />} />
        </Tooltip>
      </div>
    </>
  );
};

export default TableFilters;
