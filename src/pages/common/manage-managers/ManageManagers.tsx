import { UserCog, UserPlus } from "lucide-react";
import { formatValue } from "../../../utils";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { HasPermission } from "../../../components/auth";
import {
  ActionCard,
  Button,
  CountCard,
  DoughnutChart,
  Graph,
  GraphSkeleton,
  Header,
  InfoPopup,
  Paginator,
  SectionHeader,
} from "../../../components/ui";
import { MANAGER_NS, MANAGER_VIDEO } from "../../../constants";
import { useLanguageStore, useUserStore } from "../../../store";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import {
  useDebounce,
  useDeleteManager,
  useGetAllManagers,
  useGetManagersCount,
  useUnblockAccount,
} from "../../../hooks";
import {
  DeletePopup,
  ManagersTable,
  TableFilters,
  UnblockPopup,
} from "./views";

const MANAGER_HOVER_OFFSET = 5;

const MANAGER_GRAPH_LABEL_KEYS = [
  "manageManagersPage.graph.labels.active",
  "manageManagersPage.graph.labels.locked",
  "manageManagersPage.graph.labels.blocked",
];

const MANAGER_GRAPH_BACKGROUND_COLORS = ["#10B981", "#F59E0B", "#000000"];

export const ManageManagersPage = () => {
  const userRole = useUserStore((state) => state.role);

  const { t } = useTranslation([MANAGER_NS]);
  const { language } = useLanguageStore();

  const [selectedID, setSelectedID] = useState<string>("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isUnblockPopupOpen, setIsUnblockPopupOpen] = useState(false);

  const handleDeletePopupOpen = (id: string) => {
    setSelectedID(id);
    setIsDeletePopupOpen(true);
  };
  const handleUnblockPopupOpen = (id: string) => {
    setSelectedID(id);
    setIsUnblockPopupOpen(true);
  };

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

  const {
    managers,
    metadata,
    isLoading: isManagersDataLoading,
  } = useGetAllManagers(page, pageSize, searchKey, searchQuery);

  const {
    totalCount,
    lockedCount,
    blockedCount,
    isLoading: isManagersCountLoading,
  } = useGetManagersCount();

  const data = {
    labels: MANAGER_GRAPH_LABEL_KEYS.map((key) => t(key)),
    datasets: [
      {
        label: t("manageManagersPage.graph.label"),
        data: [
          totalCount - (lockedCount + blockedCount),
          lockedCount,
          blockedCount,
        ],
        backgroundColor: MANAGER_GRAPH_BACKGROUND_COLORS,
        hoverOffset: MANAGER_HOVER_OFFSET,
      },
    ],
  };

  const { mutate: deleteManager, isPending: isDeleting } = useDeleteManager();

  const { mutate: unblockAccount, isPending: isUnblockAccountLoading } =
    useUnblockAccount();

  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteManager(selectedID);
    setIsDeletePopupOpen(false);
  };

  const handleConfirmUnblock = () => {
    if (!selectedID) return;
    unblockAccount(selectedID);
    setIsUnblockPopupOpen(false);
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t("manageManagersPage.header.heading")}
        subtitle={t("manageManagersPage.header.subtitle")}
      />

      <div className="w-full flex items-center justify-center">
        <InfoPopup
          title={t("infoPopup.title")}
          description={t("infoPopup.description")}
          videoUrl={MANAGER_VIDEO}
        />
      </div>

      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* Count Card */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <CountCard
              title={t("manageManagersPage.countCard.title")}
              description={t("manageManagersPage.countCard.description")}
              count={formatValue(totalCount, language)}
              icon={<UserCog size={28} />}
              bgColor="bg-[#b38e19]"
            />
          </div>
        </div>

        {/* Chart & Action Card */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Chart Section */}
          <div className="w-full md:w-1/2">
            {isManagersCountLoading ? (
              <GraphSkeleton />
            ) : (
              <Graph
                title={t("manageManagersPage.graph.title")}
                description={t("manageManagersPage.graph.description")}
                width="w-full"
                height="h-[320px]"
              >
                <DoughnutChart
                  datasetIdKey="category-doughnut"
                  data={data}
                  height={200}
                />
              </Graph>
            )}
          </div>

          {/* Action Card Section */}
          <div className="w-full md:w-1/2">
            <HasPermission permission="Add Manager">
              <ActionCard
                icon={<UserPlus />}
                iconBgColor="bg-[#f5e4b2]"
                iconColor="text-[#b38e19]"
                title={t("manageManagersPage.addActionCard.title")}
                description={t("manageManagersPage.addActionCard.description")}
              >
                <NavLink to={`/${userRole}/add-manager`}>
                  <Button fullWidth variant="secondary">
                    {t("manageManagersPage.addActionCard.button")}
                  </Button>
                </NavLink>
              </ActionCard>
            </HasPermission>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader
          title={t("manageManagersPage.sectionHeader.title")}
          description={t("manageManagersPage.sectionHeader.description")}
        />

        <TableFilters
          searchBy={metadata?.searchBy}
          getParam={getParam}
          setParam={setParam}
          clearParams={clearParams}
        />

        <div className="w-full overflow-x-auto">
          <ManagersTable
            managers={managers}
            isLoading={isManagersDataLoading}
            handleDeleteManager={handleDeletePopupOpen}
            handleUnblockManager={handleUnblockPopupOpen}
          />
        </div>
        {/* Pagination Component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isManagersDataLoading}
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
      <DeletePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => {
          setIsDeletePopupOpen(false);
        }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
      <UnblockPopup
        isOpen={isUnblockPopupOpen}
        handleClose={() => {
          setIsUnblockPopupOpen(false);
        }}
        handleConfirmUnblock={handleConfirmUnblock}
        isLoading={isUnblockAccountLoading}
      />
    </div>
  );
};

export default ManageManagersPage;
