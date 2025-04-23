import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/Button";
import { CalendarSearch, CirclePlus, FileDown } from "lucide-react";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { Header } from "../../../components/ui/Header";
import { Paginator } from "../../../components/ui/Paginator";
import { downloadFile, formatValue, showToast } from "../../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../../context/store";
import { useDebounce } from "../../../hooks/useDebounceHook";
import { ActionCard } from "../../../components/ui/ActionCard";
import { CountCard } from "../../../components/ui/CountCard";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFiltersHook } from "../../../hooks/useFiltersHook";
import { IAttendanceCredentials } from "../../../interfaces";
import { AttendanceSchema } from "../../../validation";
import { AddAttendancePopup, AttendancesTable, AttendanceTableFilters, DeleteAttendancePopup, EditAttendancePopup, ExportAttendancePopup, RenderAttendanceInputs, ShowAttendancePopup } from "./views";
import { useExportEmployeesAttendanceData } from "../../../hooks/useReportsHook";
import { useGetAllAttendanceData, useGetDetailedAttendance, useManageAttendance } from "../../../hooks/useAttendanceHook";
import { ATTENDANCE_TRANSLATION_NAMESPACE } from ".";
import { HasPermission } from "../../../components/auth";

const ManageAttendancePage = () => {
  const { t } = useTranslation(["common", ATTENDANCE_TRANSLATION_NAMESPACE]);
  const { language } = useSelector((state: RootState) => state.language);

  const { register, handleSubmit, formState: { errors }, reset} = useForm<IAttendanceCredentials>({
    resolver: yupResolver(AttendanceSchema),
    mode: "onChange"
  });

  const [selectedID, setSelectedID] = useState<number>(0);

  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDownloadReportPopupOpen, setIsDownloadReportPopupOpen] = useState(false);

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsShowPopupOpen(true) 
  }
  const handleAddPopupOpen = () => {
    setSelectedID(0)
    reset({ deviceId: 0, employeeId: 0, attendanceDate: "", attendanceTime: "", status: "" })
    setIsAddPopupOpen(true)
  }
  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsEditPopupOpen(true)
  }

  const handleEditPopupClose = () => {
    setSelectedID(0)
    reset({ id: 0, deviceId: 0, employeeId: 0, attendanceDate: "", attendanceTime: "", status: "" })
    setIsEditPopupOpen(false)
  }
  const handleDeletePopupOpen = (id: number) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }

  const {
    page, pageSize, searchKey, search, 
    startDate, endDate, startTime, endTime, 
    status, searchByDepartmentId,
    searchBySubDeptartmentId, setFilters
  } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);

  const { attendancesData, totalAttendances, metadata, isAttendancesDataLoading } = useGetAllAttendanceData(
    Number(page) || 1, Number(pageSize) || 5, searchKey || "", debouncedSearchQuery || "",
    startDate || "", endDate || "", startTime || "", endTime || "", status || "", Number(searchByDepartmentId || ''),
    Number(searchBySubDeptartmentId || "")
  );


  // Use the custom hook to fetch data
  const { refetch, isLoading: isExportLoding } = useExportEmployeesAttendanceData(
    searchKey || "", debouncedSearchQuery || "", startDate || "", endDate || "", startTime || "", endTime || "", status || "", Number(searchByDepartmentId || ''),
    Number(searchBySubDeptartmentId || ""));


  const { detailedAttendance, isDetailedAttendanceLoading } = useGetDetailedAttendance(selectedID, reset);

  const renderAttendanceInputs = <RenderAttendanceInputs register={register} errors={errors} t={t} />

  const {
    addAttendance,
    updateAttendance,
    deleteAttendance,
    isAdding,
    isUpdating,
    isDeleting
  } = useManageAttendance();
  
  /* ____________ HANDLER ____________ */
  const handleConfirmAdd: SubmitHandler<IAttendanceCredentials> = (request: IAttendanceCredentials) => {
    addAttendance(request)
    setIsAddPopupOpen(false)
  };
  const handleConfirmUpdate: SubmitHandler<IAttendanceCredentials> = (request: IAttendanceCredentials) => {
    updateAttendance(request)
    setIsEditPopupOpen(false)
  };
  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteAttendance(selectedID)
    setIsDeletePopupOpen(false)
    setIsShowPopupOpen(false)
  };

  const handleDownload = async () => {
    const { data, isSuccess, isError } = await refetch();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file)
    }
    if (isError) {
      showToast("error", t("export.exportError"));
    }
  };


  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("header.heading", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })} subtitle={t("header.subtitle", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })} />
        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <CountCard 
            title={t("CountCard.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
            description={t("CountCard.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
            count={formatValue(totalAttendances, language)}
            icon={<CalendarSearch size={28} />} 
            bgColor="bg-[#b38e19]" 
          />
          {/* ActionCard */}
        </div>
        <div className="w-[1000px] max-xl:w-full grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto">
          <HasPermission permission="Add Attendance">
            <ActionCard
              icon={<CirclePlus />}
              iconBgColor="bg-[#f5e4b2]"
              iconColor="text-[#b38e19]"
              title={t("attendanceActions.addNew.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
              description={t("attendanceActions.addNew.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
            >
              <Button fullWidth={true} variant="secondary" onClick={handleAddPopupOpen}>
                {t("attendanceActions.addNew.button", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
              </Button>
            </ActionCard>
          </HasPermission>
          <HasPermission permission="Export Attendance Report">
            <ActionCard
              icon={<FileDown />}
              iconBgColor="bg-[#a7f3d0]"
              iconColor="text-[#10b981]"
              title={t("attendanceActions.exportData.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
              description={t("attendanceActions.exportData.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
            >
              <Button fullWidth={true} variant="success" isLoading={isExportLoding} onClick={() => {
                setIsDownloadReportPopupOpen(true)
              }}>
                {t("attendanceActions.exportData.button", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
              </Button>
            </ActionCard>
          </HasPermission>
        </div>


        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("sectionHeader.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })} 
            description={t("sectionHeader.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })} 
          />

          <div className="flex flex-col gap-5">
            <AttendanceTableFilters searchBy={metadata.searchBy} t={t} />
          </div>
          <div className="w-full overflow-x-auto">
            <AttendancesTable 
              attendances={attendancesData} 
              isLoading={isAttendancesDataLoading} 
              handleShowAttendance={handleShowPopupOpen} 
              handleEditAttendance={handleEditPopupOpen}
              handleDeleteAttendance={handleDeletePopupOpen}
              t={t}
            />
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isAttendancesDataLoading}
            onClickFirst={() => setFilters({ page: 1 })}
            onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
            onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
          />
        </div>
      </div>

      <AddAttendancePopup
        isOpen={isAddPopupOpen}
        formInputs={renderAttendanceInputs}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        handleClose={() => setIsAddPopupOpen(false)}
        isLoading={isAdding}
        t={t}
      />

      <EditAttendancePopup
        isOpen={isEditPopupOpen} 
        handleClose={handleEditPopupClose} 
        isLoading={isUpdating}
        handleSubmit={handleSubmit(handleConfirmUpdate)} 
        formInputs={renderAttendanceInputs}
        t={t}
      />

      <DeleteAttendancePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />;

      <ShowAttendancePopup
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)} 
        handleDeletePopupOpen={() => {
          handleDeletePopupOpen(selectedID)
        }}
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID)
          setIsShowPopupOpen(false)
        }}
        attendance={detailedAttendance}
        isLoading={isDetailedAttendanceLoading}
        t={t}
      />

      <ExportAttendancePopup
        isOpen={isDownloadReportPopupOpen}
        handleClose={() => setIsDownloadReportPopupOpen(false)} 
        handleDownload={() => {
          handleDownload()
        }}
        filteredData={{
          searchKey: searchKey || "",
          search: search || "",
          startDate: startDate || "",
          endDate: endDate || "",
          startTime: startTime || "",
          endTime: endTime || "",
          status: status || "",
          searchByDepartmentId: Number(searchByDepartmentId || 0),
          searchBySubDeptartmentId: Number(searchBySubDeptartmentId || 0),
        }}
        isLoading={isExportLoding}
        t={t}
      />
    </>
  )
}

export default ManageAttendancePage