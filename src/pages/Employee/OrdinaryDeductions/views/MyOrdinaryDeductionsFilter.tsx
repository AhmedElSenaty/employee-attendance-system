import { formatValue } from "../../../../utils";
import { Calendar, RefreshCcw } from "lucide-react";
import { useLanguageStore } from "../../../../store/";
import {
  Button,
  CustomSelect,
  Field,
  Input,
  Label,
  Tooltip,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";

interface Props {
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
  searchBy: string[];
}

const MyOrdinaryDeductionsFilter = ({
  getParam,
  setParam,
  clearParams,
}: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation("workOvertime");

  const pageSizeOptions = [10, 20, 30, 40, 50].map((size) => ({
    value: size,
    label: formatValue(size, language),
  }));

  const selectedPageSizeValue = pageSizeOptions.find(
    (opt) =>
      opt.value === (getParam("pageSize") ? Number(getParam("pageSize")) : 10)
  );

  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* page count */}
      <Field className="w-[90px] flex flex-col space-y-2">
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

      {/* start date */}
      <Field className="w-[180px] flex flex-col space-y-2">
        <Label>{t("filters.startDate")}</Label>
        <Input
          type="date"
          icon={<Calendar />}
          value={getParam("startDate") ?? ""}
          onChange={(e) => setParam("startDate", e.target.value)}
        />
      </Field>

      {/* end date */}
      <Field className="w-[180px] flex flex-col space-y-2">
        <Label>{t("filters.endDate")}</Label>
        <Input
          type="date"
          icon={<Calendar />}
          value={getParam("endDate") ?? ""}
          onChange={(e) => setParam("endDate", e.target.value)}
        />
      </Field>

      <Tooltip content={t("filters.toolTipResetFilters")}>
        <Button onClick={clearParams} icon={<RefreshCcw />} />
      </Tooltip>
    </div>
  );
};

export default MyOrdinaryDeductionsFilter;
