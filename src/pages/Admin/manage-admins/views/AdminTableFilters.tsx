import { TFunction } from "i18next"; // Importing translation function for internationalization (i18n)
import { Field, Input, Label, SelectBox } from "../../../../components/ui"; // Importing form elements
import { formatValue } from "../../../../utils"; // Utility function for formatting values
import { Search } from "lucide-react"; // Search icon component
import { useFiltersHook } from "../../../../hooks/filter.hook"; // Custom hook for handling filters
import { ADMIN_TRANSLATION_NAMESPACE } from "..";
import { useLanguageStore } from "../../../../store/language.store";

interface IAdminTableFiltersProps {
  searchBy: string[]; // List of available search options
  t: TFunction; // Translation function for i18n
}

const AdminTableFilters = ({ searchBy, t }: IAdminTableFiltersProps) => {
    const { language } = useLanguageStore(); // Accessing the current language from the Redux state
  const { pageSize, searchKey, search, setFilters } = useFiltersHook(); // Using custom hook for filter values and setter functions
  return (
    <>
      {/* Page Size Filter */}
      <Field className="space-y-3 w-full sm:w-auto flex flex-col">
        <Label>{t("pagination.pageSize")}</Label> {/* Label for page size */}
        <SelectBox
          value={pageSize ?? 5} 
          onChange={(e) => setFilters({ pageSize: e.target.value ? parseInt(e.target.value) : 5 })} // Handling page size change
        >
          {[5, 10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>{formatValue(size, language)}</option> // Option for each page size with value formatting
          ))}
        </SelectBox>
      </Field>

      {/* Search Type Filter */}
      <Field className="space-y-3 w-full sm:w-auto flex flex-col">
        <Label size="md">{t("manageAdminsPage.searchBy.label", { ns: ADMIN_TRANSLATION_NAMESPACE })} </Label> {/* Search label */}
        <SelectBox value={searchKey ?? ""} onChange={(e) => setFilters({ searchKey: e.target.value })}>
          <option value="">
            {t(`manageAdminsPage.searchBy.default`, { ns: ADMIN_TRANSLATION_NAMESPACE })} {/* Default search type option */}
          </option>
          {searchBy.map((search, idx) => (
            <option key={idx} value={String(search)}>
              {t(`manageAdminsPage.searchBy.${String(search)}`, { ns: ADMIN_TRANSLATION_NAMESPACE }) ?? ""}
            </option> // Dynamically created search options based on available keys
          ))}
        </SelectBox>
      </Field>

      {/* Search Input */}
      <Field className="flex-1 w-full sm:w-auto flex flex-col space-y-3">
        <Label size="md">{t("search.label")}</Label> {/* Label for search */}
        <Input
          placeholder={t("search.placeholder")} // Placeholder for search input
          icon={<Search size={18} className="text-gray-500" />} // Search icon in the input field
          value={search ?? ""}
          onChange={(e) => setFilters({ search: e.target.value })} // Handling search input changes
        />
      </Field>
    </>
  );
};

export default AdminTableFilters;
