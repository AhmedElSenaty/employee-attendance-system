import { FileDown, FilePlus, UserCog, UserPlus } from "lucide-react";
import { downloadFile, formatValue, showToast } from "../../../utils";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import {
  useDebounce,
  useUnblockAccount,
  useDeleteEmployee,
  useGetAllEmployees,
  useGetEmployeesCount,
  useGetEmployeeVacationsByID,
  useRestEmployeeTimeVacations,
  useToggleReportEmployeeStatus,
  useUploadAttendanceExcel,
  useResetEmployeePassword,
  useToggleSupervision,
  useExportGetEmployeesVerificationExcel,
  useExportGetEmployeesVerificationPDF,
} from "../../../hooks/";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore, useUserStore } from "../../../store/";
import {
  ActionCard,
  BarChart,
  Button,
  CountCard,
  Graph,
  GraphSkeleton,
  Header,
  InfoPopup,
  Paginator,
  SectionHeader,
} from "../../../components/ui";
import { TimeToRest } from "../../../enums";
import {
  RestVacationsPopup,
  ChangeIncludedStatusPopup,
  DeletePopup,
  EmployeeLeaveStatsPopup,
  EmployeesTable,
  TableFilters,
  UnblockPopup,
} from "./views";
import { EMPLOYEE_NS, EMPLOYEE_VIDEO } from "../../../constants";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import ExportVerificationPopup from "./views/ExportVerificationPopup";

const EMPLOYEE_BORDER_WIDTH = 2;

const EMPLOYEE_GRAPH_LABEL_KEYS = [
  "manageEmployeesPage.graph.labels.active",
  "manageEmployeesPage.graph.labels.deactivated",
  "manageEmployeesPage.graph.labels.locked",
  "manageEmployeesPage.graph.labels.blocked",
];

const EMPLOYEE_GRAPH_BACKGROUND_COLORS = [
  "#33FF57",
  "#FFAA33",
  "#3357FF",
  "#FF3370",
];

const EMPLOYEE_GRAPH_BORDER_COLORS = [
  "#27AE60",
  "#E67E22",
  "#2980B9",
  "#D81B60",
];

export const ManageEmployeesPage = () => {
  const userRole = useUserStore((state) => state.role);
  const { t } = useTranslation([EMPLOYEE_NS]);

  const { language } = useLanguageStore();

  const [selectedID, setSelectedID] = useState<string>("");

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isUnblockPopupOpen, setIsUnblockPopupOpen] = useState(false);
  const [isChangeIncludedStatusPopupOpen, setIsChangeIncludedStatusPopupOpen] =
    useState(false);
  const [isLeaveStatsPopupOpen, setIsLeaveStatsPopupOpen] = useState(false);
  const [isRestPopupOpen, setIsRestPopupOpen] = useState(false);

  const { mutate: restEmployeeVacations, isPending: isResting } =
    useRestEmployeeTimeVacations();

  const handleConfirmRest = (time: TimeToRest) => {
    restEmployeeVacations(time);
  };
  const handleDeletePopupOpen = (id: string) => {
    setSelectedID(id);
    setIsDeletePopupOpen(true);
  };
  const handleUnblockPopupOpen = (id: string) => {
    setSelectedID(id);
    setIsUnblockPopupOpen(true);
  };
  const handleChangeIncludedStatusPopupOpen = (id: string) => {
    setSelectedID(id);
    setIsChangeIncludedStatusPopupOpen(true);
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

  // ✅ exact names and boolean parsing
  const includeDept =
    getParam("IncludeDepartment", (v) => v === "true") ?? false;

  const includeSubDept =
    getParam("IncludeSubDepartment", (v) => v === "true") ?? false;

  const {
    employees,
    metadata,
    isLoading: isEmployeesDataLoading,
    refetch,
  } = useGetAllEmployees(page, pageSize, searchKey, searchQuery);

  const {
    totalCount,
    activatedCount,
    deactivatedCount,
    lockedCount,
    blockedCount,
    isLoading: isEmployeesCountLoading,
  } = useGetEmployeesCount();

  const { employeeVacations, isLoading: isEmployeeVacationsLoading } =
    useGetEmployeeVacationsByID(selectedID);

  const barData = {
    labels: EMPLOYEE_GRAPH_LABEL_KEYS.map((key) => t(key)),
    datasets: [
      {
        label: t("manageEmployeesPage.graph.label"),
        data: [activatedCount, deactivatedCount, lockedCount, blockedCount],
        backgroundColor: EMPLOYEE_GRAPH_BACKGROUND_COLORS,
        borderColor: EMPLOYEE_GRAPH_BORDER_COLORS,
        borderWidth: EMPLOYEE_BORDER_WIDTH,
      },
    ],
  };

  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

  const { mutate: unblockAccount, isPending: isUnblockAccountLoading } =
    useUnblockAccount();

  const { mutate: toggleReport, isPending: isToggleReportLoading } =
    useToggleReportEmployeeStatus();

  const { mutate: ToggleSupervision } = useToggleSupervision();

  const { mutate: resetPassword, isPending: isLoading } =
    useResetEmployeePassword();

  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteEmployee(selectedID);
    setIsDeletePopupOpen(false);
  };

  const handleLeaveStatsPopupOpen = (id: string) => {
    setSelectedID(id);
    setIsLeaveStatsPopupOpen(true);
  };

  const handleConfirmUnblock = () => {
    if (!selectedID) return;
    unblockAccount(selectedID);
    setIsUnblockPopupOpen(false);
  };

  const handleResetPassword = (id: string) => {
    if (!id) return;
    resetPassword(id);
  };

  const handleToggleSupervision = async (id: string) => {
    try {
      ToggleSupervision(id);
      await refetch();
    } catch (error) {
      console.error("Error toggling supervisor role", error);
    }
  };

  const handleConfirmToggleReport = async () => {
    if (!selectedID) return;
    toggleReport(selectedID);
    await refetch();
    setIsChangeIncludedStatusPopupOpen(false);
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/Employees_Template.xlsx"; // Public folder path
    link.download = "Employees_Template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { mutate: uploadExcel, isPending: isUploading } =
    useUploadAttendanceExcel();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadExcel(file, {
      onSettled: () => {
        // allow selecting the same file again
        e.target.value = "";
      },
    });
  };

  // =============== pdf =====================
  const [isDownloadingReportPDF, setIsDownloadingReportPDF] = useState(false);

  const [isDownloadReportPopupOpen, setIsDownloadReportPopupOpen] =
    useState(false);

  const { refetchExportDataPDF: getPDF } = useExportGetEmployeesVerificationPDF(
    includeDept,
    includeSubDept
  );

  const handleDownloadVerificationPDF = async () => {
    setIsDownloadingReportPDF(true);
    const { data, isSuccess, isError } = await getPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingReportPDF(false);
    }
    if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingReportPDF(false);
    }
  };

  // =============== excel =====================
  const [isDownloadingReportExcel, setIsDownloadingReportExcel] =
    useState(false);

  const { refetchExportDataExcel: VerificationExcel } =
    useExportGetEmployeesVerificationExcel(includeDept, includeSubDept);

  const handleDownloadVerificationExcel = async () => {
    setIsDownloadingReportExcel(true);
    const { data, isSuccess, isError } = await VerificationExcel();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingReportExcel(false);
    }
    if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingReportExcel(false);
    }
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t("manageEmployeesPage.header.heading")}
        subtitle={t("manageEmployeesPage.header.subtitle")}
      />

      <div className="w-full flex items-center justify-center">
        <InfoPopup
          title={t("infoPopup.title")}
          description={t("infoPopup.description")}
          videoUrl={EMPLOYEE_VIDEO}
        />
      </div>

      <div className="max-w-[1500px] mx-auto space-y-6">
        {/* Count Card */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <CountCard
              title={t("manageEmployeesPage.countCard.title")}
              description={t("manageEmployeesPage.countCard.description")}
              count={formatValue(totalCount, language)}
              icon={<UserCog size={28} />}
              bgColor="bg-[#b38e19]"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/3">
            {isEmployeesCountLoading ? (
              <GraphSkeleton />
            ) : (
              <Graph
                title={t("manageEmployeesPage.graph.title")}
                description={t("manageEmployeesPage.graph.description")}
                width="w-full"
                height="h-[320px]"
              >
                <BarChart
                  datasetIdKey="employees-bar"
                  data={barData}
                  height={200}
                />
              </Graph>
            )}
          </div>

          <div className="w-full md:w-1/3">
            <HasPermission permission="Add Employee">
              <ActionCard
                icon={<UserPlus />}
                iconBgColor="bg-[#f5e4b2]"
                iconColor="text-[#b38e19]"
                title={t("manageEmployeesPage.addActionCard.title")}
                description={t("manageEmployeesPage.addActionCard.description")}
              >
                <NavLink to={`/${userRole}/add-employee`}>
                  <Button fullWidth variant="secondary">
                    {t("manageEmployeesPage.addActionCard.button")}
                  </Button>
                </NavLink>
              </ActionCard>
            </HasPermission>
          </div>

          <div className="w-full md:w-1/3">
            <HasPermission
              permission={[
                "Export Employee Verification Report Excel",
                "Export Employee Verification Report PDF",
              ]}
            >
              <ActionCard
                icon={<FileDown />}
                iconBgColor="bg-[#f5e4b2]"
                iconColor="text-[#10b981]"
                title={t("verificationActionCard.title")}
                description={t("verificationActionCard.description")}
              >
                <Button
                  fullWidth
                  variant="secondary"
                  isLoading={isDownloadingReportPDF || isDownloadingReportExcel}
                  onClick={() => {
                    setIsDownloadReportPopupOpen(true);
                  }}
                >
                  {t("verificationActionCard.button")}
                </Button>
              </ActionCard>
            </HasPermission>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full md:w-1/3">
            <HasPermission permission="Reset Employees Data">
              <ActionCard
                icon={<UserCog />}
                iconBgColor="bg-[#d7f0f6]"
                iconColor="text-[#007fa4]"
                title={t("manageEmployeesPage.restActionCard.title")}
                description={t(
                  "manageEmployeesPage.restActionCard.description"
                )}
              >
                <Button
                  fullWidth
                  variant="primary"
                  onClick={() => setIsRestPopupOpen(true)}
                >
                  {t("manageEmployeesPage.restActionCard.button")}
                </Button>
              </ActionCard>
            </HasPermission>
          </div>

          <div className="w-full md:w-1/3">
            <HasPermission permission="Add Employee">
              <ActionCard
                icon={<FilePlus />}
                iconBgColor="bg-[#bfdbfe]" // light blue
                iconColor="text-[#3b82f6]" // blue
                title={t("importActionCard.title")}
                description={t("importActionCard.description")}
              >
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDownloadTemplate}
                    fullWidth
                  >
                    {t("importActionCard.downloadTemplate")}
                  </Button>
                  <Button
                    variant="primary"
                    isLoading={isUploading}
                    onClick={handleImportClick}
                    fullWidth
                  >
                    {t("importActionCard.importFile")}
                  </Button>
                  <input
                    type="file"
                    accept=".xlsx"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImportFile}
                  />
                </div>
              </ActionCard>
            </HasPermission>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader
          title={t("manageEmployeesPage.sectionHeader.title")}
          description={t("manageEmployeesPage.sectionHeader.description")}
        />

        <TableFilters
          searchBy={metadata?.searchBy}
          getParam={getParam}
          setParam={setParam}
          clearParams={clearParams}
        />

        <div className="w-full overflow-x-auto">
          <EmployeesTable
            employees={employees}
            isLoading={isEmployeesDataLoading}
            handleDelete={handleDeletePopupOpen}
            handleUnblock={handleUnblockPopupOpen}
            handleChangeIncludedStatus={handleChangeIncludedStatusPopupOpen}
            handleShowLeaveStats={handleLeaveStatsPopupOpen}
            handleResetPassword={handleResetPassword}
            isResettingPassword={isLoading} // ✅ Pass loading state
            handleSupervision={handleToggleSupervision}
          />
        </div>

        {/* Pagination Component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isEmployeesDataLoading}
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
      <ChangeIncludedStatusPopup
        isOpen={isChangeIncludedStatusPopupOpen}
        handleClose={() => {
          setIsChangeIncludedStatusPopupOpen(false);
        }}
        handleConfirmChange={handleConfirmToggleReport}
        isLoading={isToggleReportLoading}
      />

      <EmployeeLeaveStatsPopup
        isOpen={isLeaveStatsPopupOpen}
        handleClose={() => setIsLeaveStatsPopupOpen(false)}
        stats={employeeVacations || null}
        isLoading={isEmployeeVacationsLoading}
      />
      <RestVacationsPopup
        isOpen={isRestPopupOpen}
        handleClose={() => setIsRestPopupOpen(false)}
        handleConfirmRest={handleConfirmRest}
        isLoading={isResting}
      />

      <ExportVerificationPopup
        isOpen={isDownloadReportPopupOpen}
        handleClose={() => setIsDownloadReportPopupOpen(false)}
        handleDownload={() => {
          handleDownloadVerificationExcel();
        }}
        isLoading={isDownloadingReportExcel}
        isloadingPDF={isDownloadingReportPDF}
        handleDownloadPDF={handleDownloadVerificationPDF}
      />
    </div>
  );
};

export default ManageEmployeesPage;
