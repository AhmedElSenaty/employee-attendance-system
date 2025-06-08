import { UserCog, UserPlus } from "lucide-react";
import { formatValue } from "../../../utils";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDebounce } from "../../../hooks/debounce.hook";
import { useFiltersHook } from "../../../hooks/filter.hook";
import { DeleteManagerPopup, ManagersTable, ManagerTableFilters, UnblockManagerPopup } from "./views";
import { MANAGER_GRAPH_LABEL_KEYS, MANAGER_HOVER_OFFSET, MANAGER_TRANSLATION_NAMESPACE, MANAGER_GRAPH_BACKGROUND_COLORS } from ".";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/language.store";
import { useUserStore } from "../../../store/user.store";
import { ActionCard, Button, CountCard, DoughnutChart, Graph, GraphSkeleton, Header, Paginator, SectionHeader } from "../../../components/ui";
import { useUnblockAccount } from "../../../hooks/account.hook";
import { useDeleteManager, useGetAllManagers, useGetManagersCount } from "../../../hooks/manager.hooks";

export const ManageManagersPage = () => {
  const userRole = useUserStore((state) => state.role);

  const { t } = useTranslation(["common", MANAGER_TRANSLATION_NAMESPACE]);
  const { language } = useLanguageStore();

  const [selectedID, setSelectedID] = useState<string>("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isUnblockPopupOpen, setIsUnblockPopupOpen] = useState(false)

  const handleDeletePopupOpen = (id: string) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }
  const handleUnblockPopupOpen = (id: string) => {
    setSelectedID(id)
    setIsUnblockPopupOpen(true) 
  }

  const { page, pageSize, searchKey, search, setFilters } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);

  const { managers, metadata, isManagersDataLoading } = useGetAllManagers(
    Number(page) || 1,
    Number(pageSize) || 5,
    searchKey || "",
    debouncedSearchQuery || ""
  );

  const { totalCount, lockedCount, blockedCount, isManagersCountLoading } = useGetManagersCount()

  const data = {
    labels: MANAGER_GRAPH_LABEL_KEYS.map(key => t(key, { ns: MANAGER_TRANSLATION_NAMESPACE })),
    datasets: [
      {
        label: t("manageManagersPage.graph.label", { ns: MANAGER_TRANSLATION_NAMESPACE }),
        data: [totalCount - (lockedCount + blockedCount), lockedCount, blockedCount],
        backgroundColor: MANAGER_GRAPH_BACKGROUND_COLORS,
        hoverOffset: MANAGER_HOVER_OFFSET,
      },
    ],
  };
  

  const { mutate: deleteManager, isPending: isDeleting } = useDeleteManager();

  const { mutate: unblockAccount, isPending: isUnblockAccountLoading } = useUnblockAccount();

  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteManager(selectedID)
    setIsDeletePopupOpen(false)
  };

  const handleConfirmUnblock = () => {
    if (!selectedID) return;
    unblockAccount(selectedID)
    setIsUnblockPopupOpen(false)
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header 
        heading={t("manageManagersPage.header.heading", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
        subtitle={t("manageManagersPage.header.subtitle", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
      />
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* Count Card */}
        <div className="flex justify-center">
          <CountCard 
            title={t("manageManagersPage.countCard.title", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
            description={t("manageManagersPage.countCard.description", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
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
              isManagersCountLoading ? (
                <GraphSkeleton />
              ) : (
              <Graph
                title={t("manageManagersPage.graph.title", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
                description={t("manageManagersPage.graph.description", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
                width="w-full"
                height="h-[320px]"
                >
                <DoughnutChart datasetIdKey="category-doughnut" data={data} height={200}  />
              </Graph>
              )
            }
          </div>

          {/* Action Card Section */}
          <div className="w-full md:w-1/2 h-fit">
            <HasPermission permission="Add Manager">
              <ActionCard
                icon={<UserPlus />}
                iconBgColor="bg-[#f5e4b2]"
                iconColor="text-[#b38e19]"
                title={t("manageManagersPage.actions.add.title", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
                description={t("manageManagersPage.actions.add.description", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
              >
                <NavLink to={`/${userRole}/add-manager`}>
                  <Button fullWidth variant="secondary">
                  {t("manageManagersPage.actions.add.button", { ns: MANAGER_TRANSLATION_NAMESPACE })}
                  </Button>
                </NavLink>
              </ActionCard>
            </HasPermission>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("manageManagersPage.sectionHeader.title", { ns: MANAGER_TRANSLATION_NAMESPACE })}
          description={t("manageManagersPage.sectionHeader.description", { ns: MANAGER_TRANSLATION_NAMESPACE })}
        />

        <div className="flex flex-wrap gap-4">
          <ManagerTableFilters searchBy={metadata?.searchBy} t={t} />
        </div>
        <div className="w-full overflow-x-auto">
          <ManagersTable
            managers={managers}
            isLoading={isManagersDataLoading}
            handleDeleteManager={handleDeletePopupOpen}
            handleUnblockManager={handleUnblockPopupOpen}
            t={t}
          />
        </div>
        {/* Pagination Component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isManagersDataLoading}
          onClickFirst={() => setFilters({ page: 1 })}
          onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
          onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
        />
      </div>
      <DeleteManagerPopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />
      <UnblockManagerPopup
        isOpen={isUnblockPopupOpen}
        handleClose={() => { setIsUnblockPopupOpen(false) }}
        handleConfirmUnblock={handleConfirmUnblock}
        isLoading={isUnblockAccountLoading}
        t={t}
      />
    </div>
  );
};

export default ManageManagersPage