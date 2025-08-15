import { useGetDepartmentsList } from "../../../../hooks/department.hooks";
import {
  Checkbox,
  CheckboxSkeleton,
  Field,
  Label,
  LabelSkeleton,
  Radio,
  RadioSkeleton,
  Button,
  ButtonSkeleton,
  Input,
} from "../../../../components/ui";
import { Dispatch, SetStateAction, useState, useMemo } from "react";
import { ListChecks, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DepartmentSummary } from "../../../../interfaces";
import { DEPARTMENT_NS } from "../../../../constants";

interface Props {
  checked: number[];
  setChecked: Dispatch<SetStateAction<number[]>>;
  isLoading?: boolean;
  needSelectOne?: boolean;
  title?: string;
  description?: string;
}

const DepartmentCheckboxes = ({
  checked,
  setChecked,
  isLoading,
  needSelectOne = false,
  title,
  description,
}: Props) => {
  const { t } = useTranslation([DEPARTMENT_NS]);
  const { departmentsList, isLoading: isDepartmentsLoading } =
    useGetDepartmentsList();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter departments based on search query
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) {
      return departmentsList;
    }
    return departmentsList.filter((department: DepartmentSummary) =>
      department.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [departmentsList, searchQuery]);

  const alldepartmentIDs = filteredDepartments.map(
    (department: DepartmentSummary) => department.id
  );

  // Select All / Deselect All handler
  const toggleSelectAll = () => {
    if (checked.length === alldepartmentIDs.length) {
      setChecked([]); // Deselect all
    } else {
      setChecked(alldepartmentIDs); // Select all
    }
  };

  const handleDepartmentSelect = (departmentID: number) => {
    if (needSelectOne) {
      setChecked([departmentID]);
    } else {
      setChecked((prev) =>
        prev.includes(departmentID)
          ? prev.filter((key) => key !== departmentID)
          : [...prev, departmentID]
      );
    }
  };

  const renderDepartmentFields = filteredDepartments.map(
    ({ id, name }: DepartmentSummary) => (
      <Field key={id} className="flex items-center space-x-2">
        {needSelectOne ? (
          <Radio
            checked={checked.includes(id)}
            onChange={() => handleDepartmentSelect(id)}
            name="departmentRadio"
          />
        ) : (
          <Checkbox
            checked={checked.includes(id)}
            onChange={() => handleDepartmentSelect(id)}
          />
        )}
        <Label>{name}</Label>
      </Field>
    )
  );

  return (
    <>
      <div className="w-full flex flex-col gap-5">
        {/* Header with inline search */}
        {(title || description) && (
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex-1">
              {title && (
                <h2 className="text-lg sm:text-2xl font-bold text-[#19355a] leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm sm:text-base text-gray-600">
                  {description}
                </p>
              )}
            </div>
            <div className="w-full sm:w-80">
              <Input
                placeholder={t("searchDepartmentsPlaceholder")}
                icon={<Search size={18} className="text-gray-500" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Search Input (when no title/description provided) */}
        {!title && !description && (
          <Field className="w-full max-w-md">
            <Label size="md">{t("searchDepartments")}</Label>
            <Input
              placeholder={t("searchDepartmentsPlaceholder")}
              icon={<Search size={18} className="text-gray-500" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Field>
        )}

        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isDepartmentsLoading || isLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Field key={i} className="flex items-center space-x-2">
                    {needSelectOne ? <RadioSkeleton /> : <CheckboxSkeleton />}
                    <LabelSkeleton />
                  </Field>
                ))}
              </>
            ) : (
              renderDepartmentFields
            )}
          </div>
        </div>
        <div className="mt-auto flex justify-end">
          {isLoading ? (
            <>
              <div className="w-36">
                <ButtonSkeleton fullWidth={false} />
              </div>
            </>
          ) : (
            <>
              {!needSelectOne && (
                <Button
                  onClick={toggleSelectAll}
                  type="button"
                  variant="secondary"
                  fullWidth={false}
                  size={"md"}
                  icon={<ListChecks className="w-full h-full" />}
                >
                  {checked.length === alldepartmentIDs.length
                    ? t("deselectAll")
                    : t("selectAll")}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DepartmentCheckboxes;
