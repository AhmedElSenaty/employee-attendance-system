import { UserCog, UserPlus } from "lucide-react";
import { formatValue } from "../../../utils";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDebounce } from "../../../hooks/debounce.hook";
import { useFiltersHook } from "../../../hooks/filter.hook";
import { DeleteEmployeePopup, EmployeesTable, EmployeeTableFilters, UnblockEmployeePopup } from "./views";
import { useDeleteEmployee, useGetAllEmployees, useGetEmployeesCount, useToggleReportEmployeeStatus } from "../../../hooks/employee.hooks";
import { EMPLOYEE_BORDER_WIDTH, EMPLOYEE_GRAPH_BACKGROUND_COLORS, EMPLOYEE_GRAPH_BORDER_COLORS, EMPLOYEE_GRAPH_LABEL_KEYS, EMPLOYEE_TRANSLATION_NAMESPACE } from ".";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/language.store";
import { useUserStore } from "../../../store/user.store";
import { ActionCard, BarChart, Button, CountCard, Graph, GraphSkeleton, Header, Paginator, SectionHeader } from "../../../components/ui";
import { useUnblockAccount } from "../../../hooks/account.hook";
import ChangeIncludedStatusPopup from "./views/ChangeIncludedStatusPopup";

export const ManageEmployeesPage = () => {
  const userRole = useUserStore((state) => state.role);
  const { t } = useTranslation(["common", EMPLOYEE_TRANSLATION_NAMESPACE]);
  const { language } = useLanguageStore();

  const [selectedID, setSelectedID] = useState<string>("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isUnblockPopupOpen, setIsUnblockPopupOpen] = useState(false)
  const [isChangeIncludedStatusPopupOpen, setIsChangeIncludedStatusPopupOpen] = useState(false)

  const handleDeletePopupOpen = (id: string) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }
  const handleUnblockPopupOpen = (id: string) => {
    setSelectedID(id)
    setIsUnblockPopupOpen(true) 
  }
  const handleChangeIncludedStatusPopupOpen = (id: string) => {
    setSelectedID(id)
    setIsChangeIncludedStatusPopupOpen(true) 
  }

  const { page, pageSize, searchKey, search, setFilters } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);

  const { employees, metadata, isEmployeesDataLoading } = useGetAllEmployees(Number(page) || 1, Number(pageSize) || 5, searchKey || "", debouncedSearchQuery || "");;

  const { totalCount, activatedCount, deactivatedCount, lockedCount, blockedCount, isEmployeesCountLoading } = useGetEmployeesCount()

  const barData = {
    labels: EMPLOYEE_GRAPH_LABEL_KEYS.map(key => t(key, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })),
    datasets: [
      {
        label: t("manageEmployeesPage.graph.label", { ns: EMPLOYEE_TRANSLATION_NAMESPACE }),
        data: [activatedCount, deactivatedCount, lockedCount, blockedCount],
        backgroundColor: EMPLOYEE_GRAPH_BACKGROUND_COLORS,
        borderColor: EMPLOYEE_GRAPH_BORDER_COLORS,
        borderWidth: EMPLOYEE_BORDER_WIDTH,
      },
    ],
  };

  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

  const { mutate: unblockAccount, isPending: isUnblockAccountLoading } = useUnblockAccount();

  const { mutate: toggleReport, isPending: isToggleReportLoading } = useToggleReportEmployeeStatus();

  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteEmployee(selectedID)
    setIsDeletePopupOpen(false)
  };


  const handleConfirmUnblock = () => {
    if (!selectedID) return;
    unblockAccount(selectedID)
    setIsUnblockPopupOpen(false)
  };

  const handleConfirmToggleReport = () => {
    if (!selectedID) return;
    toggleReport(selectedID)
    setIsChangeIncludedStatusPopupOpen(false)
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header 
        heading={t("manageEmployeesPage.header.heading", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} 
        subtitle={t("manageEmployeesPage.header.subtitle", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} 
      />
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* Count Card */}
        <div className="flex justify-center">
          <CountCard 
            title={t("manageEmployeesPage.countCard.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} 
            description={t("manageEmployeesPage.countCard.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} 
            count={formatValue(totalCount, language)}
            icon={<UserCog size={28} />} 
            bgColor="bg-[#b38e19]"
          />
        </div>

        {/* Chart & Action Card */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Chart Section */}
          <div className="w-full md:w-1/2">
            {
              isEmployeesCountLoading ? (
                <GraphSkeleton />
              ) : (
              <Graph
                title={t("manageEmployeesPage.graph.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} 
                description={t("manageEmployeesPage.graph.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} 
                width="w-full"
                height="h-[320px]"
                >
                <BarChart datasetIdKey="employees-bar" data={barData} height={200}  />
              </Graph>
              )
            }
          </div>

          {/* Action Card Section */}
          <div className="w-full md:w-1/2 h-fit">
            <HasPermission permission="Add Employee">
              <ActionCard
                icon={<UserPlus />}
                iconBgColor="bg-[#f5e4b2]"
                iconColor="text-[#b38e19]"
                title={t("manageEmployeesPage.actions.add.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} 
                description={t("manageEmployeesPage.actions.add.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} 
              >
                <NavLink to={`/${userRole}/add-employee`}>
                  <Button fullWidth variant="secondary">
                  {t("manageEmployeesPage.actions.add.button", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
                  </Button>
                </NavLink>
              </ActionCard>
            </HasPermission>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("manageEmployeesPage.sectionHeader.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          description={t("manageEmployeesPage.sectionHeader.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
        />

        <div className="flex flex-wrap gap-4">
          <EmployeeTableFilters searchBy={metadata?.searchBy} t={t} />
        </div>
        <div className="w-full overflow-x-auto">
          <EmployeesTable
            employees={employees}
            isLoading={isEmployeesDataLoading}
            handleDeleteEmployee={handleDeletePopupOpen}
            handleUnblockEmployee={handleUnblockPopupOpen}
            handleChangeIncludedStatusEmployee={handleChangeIncludedStatusPopupOpen}
            t={t}
          />
        </div>
        {/* Pagination Component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isEmployeesDataLoading}
          onClickFirst={() => setFilters({ page: 1 })}
          onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
          onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
        />
      </div>
      <DeleteEmployeePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />
      <UnblockEmployeePopup
        isOpen={isUnblockPopupOpen}
        handleClose={() => { setIsUnblockPopupOpen(false) }}
        handleConfirmUnblock={handleConfirmUnblock}
        isLoading={isUnblockAccountLoading}
        t={t}
      />
      <ChangeIncludedStatusPopup
        isOpen={isChangeIncludedStatusPopupOpen}
        handleClose={() => { setIsChangeIncludedStatusPopupOpen(false) }}
        handleConfirmChange={handleConfirmToggleReport}
        isLoading={isToggleReportLoading}
        t={t}
      />
    </div>
  );
};

export default ManageEmployeesPage