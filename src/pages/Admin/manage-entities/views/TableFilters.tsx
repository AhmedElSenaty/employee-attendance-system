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
import { ENTITY_NS } from "../../../../constants";
import { useGetEntitiesList } from "../../../../hooks";
import { EntitySummary } from "../../../../interfaces";
import { useSearchParams } from "react-router";

interface Props {
  searchBy: string[];
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
}

const TableFilters = ({ searchBy, getParam, setParam, clearParams }: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation([ENTITY_NS]);

  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: Record<string, string>) => {
    for (const key in params) {
      searchParams.set(key, params[key]);
    }
    setSearchParams(searchParams);
  };

  const { entitiesList, isLoading: entitiesListIsLoading } =
    useGetEntitiesList();

  const entityOptions =
    entitiesList?.map((entity: EntitySummary) => ({
      value: entity.name,
      label: entity.name,
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

  const selectedEntityValue = entityOptions.find(
    (opt: { value: number; label: string }) =>
      opt.value === getParam("SearchByName")
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
            placeholder={t("filters.select.placeholder")}
            options={searchByOptions}
            value={selectedSearchByValue}
            onChange={(option) => setParam("searchKey", String(option?.value))}
            isSearchable
          />
        </Field>

        {/* Search Input */}
        <Field className="w-[200px] sm:w-[250px] md:w-[300px] flex flex-col space-y-2">
          <Label size="md">{t("filters.search.label")}</Label>
          <Input
            placeholder={t("filters.search.placeholder")}
            icon={<Search size={18} className="text-gray-500" />}
            value={getParam("searchQuery") ?? ""}
            onChange={(e) => setParam("searchQuery", e.target.value)}
          />
        </Field>

        <Field className="w-[200px] space-y-2">
          <Label size="lg">{t("inputs.name.label")}</Label>
          {entitiesListIsLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              placeholder={t("filters.select.placeholder")}
              className="w-full"
              options={entityOptions}
              value={selectedEntityValue}
              onChange={(option) => {
                const name = String(option?.value ?? "");
                setSearchParams({
                  searchKey: "SearchByName",
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
