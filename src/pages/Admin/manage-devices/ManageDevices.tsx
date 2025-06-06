import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/Button";
import { CirclePlus, Fingerprint } from "lucide-react";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { Header } from "../../../components/ui/Header";
import { Paginator } from "../../../components/ui/Paginator";
import { formatValue } from "../../../utils";
import { useDebounce } from "../../../hooks/useDebounceHook";
import { ActionCard } from "../../../components/ui/ActionCard";
import { CountCard } from "../../../components/ui/CountCard";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFiltersHook } from "../../../hooks/useFiltersHook";
import { AddDevicePopup, DeleteDevicePopup, DevicesTable, DeviceTableFilters, EditDevicePopup, RenderDeviceInputs, ShowDevicePopup } from "./views";
import { IDeviceCredentials } from "../../../interfaces";
import { deviceSchema } from "../../../validation";
import { useGetAllDevices, useGetDeviceByID, useManageDevices } from "../../../hooks/useDeviceHook";
import { DEVICE_TRANSLATION_NAMESPACE } from ".";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/language.store";

const ManageDevicesPage = () => {
  const { t } = useTranslation(["common", DEVICE_TRANSLATION_NAMESPACE]);
    const { language } = useLanguageStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<IDeviceCredentials>({
    resolver: yupResolver(deviceSchema),
    mode: "onChange"
  });

  const [selectedID, setSelectedID] = useState<number>(0);
  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsShowPopupOpen(true) 
  }
  const handleAddPopupOpen = () => {
    setSelectedID(0)
    reset({ id: 0, device_name: "", iP_Address: "", port: 4370 })
    setIsAddPopupOpen(true)
  }
  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsEditPopupOpen(true)
  }
  const handleEditPopupClose = () => {
    setSelectedID(0)
    reset( {id: 0, device_name: "", iP_Address: "" })
    setIsEditPopupOpen(false)
  }
  const handleDeletePopupOpen = (id: number) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }

  const { page, pageSize, searchKey, search, setFilters } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);

  const { devices, totalDevices, metadata, isDevicesDataLoading } = useGetAllDevices(
    Number(page) || 1, 
    Number(pageSize) || 5, 
    searchKey || "", 
    debouncedSearchQuery || ""
  );

  const { device, isDeviceDataLoading } = useGetDeviceByID(selectedID, reset);

  const renderDeviceInputs = <RenderDeviceInputs register={register} errors={errors} t={t} isLoading={isDeviceDataLoading} />

  const {
    addDevice,
    updateDevice,
    deleteDevice,
    isAdding,
    isUpdating,
    isDeleting
  } = useManageDevices();

  /* ____________ HANDLER ____________ */
  const handleConfirmAdd: SubmitHandler<IDeviceCredentials> = (request: IDeviceCredentials) => {
    addDevice(request)
    setIsAddPopupOpen(false)
  };
  const handleConfirmUpdate: SubmitHandler<IDeviceCredentials> = (request: IDeviceCredentials) => {
    updateDevice(request)
    setIsEditPopupOpen(false)
  };
  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteDevice(selectedID)
    setIsDeletePopupOpen(false)
    setIsShowPopupOpen(false)
  };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("header.heading", { ns: DEVICE_TRANSLATION_NAMESPACE })} subtitle={t("header.subtitle", { ns: DEVICE_TRANSLATION_NAMESPACE })} />
        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <CountCard 
            title={t("CountCard.title", { ns: DEVICE_TRANSLATION_NAMESPACE })}
            description={t("CountCard.description", { ns: DEVICE_TRANSLATION_NAMESPACE })}
            count={formatValue(totalDevices, language)}
            icon={<Fingerprint size={28} />} 
            bgColor="bg-[#b38e19]" 
          />
          <HasPermission permission="Add Device">
            <ActionCard
              icon={<CirclePlus />}
              iconBgColor="bg-[#f5e4b2]"
              iconColor="text-[#b38e19]"
              title={t("actions.add.title", { ns: DEVICE_TRANSLATION_NAMESPACE })}
              description={t("actions.add.description", { ns: DEVICE_TRANSLATION_NAMESPACE })}
            >
              <Button fullWidth={true} variant="secondary" onClick={handleAddPopupOpen}>
                {t("actions.add.button", { ns: DEVICE_TRANSLATION_NAMESPACE })}
              </Button>
            </ActionCard>
          </HasPermission>
        </div>

        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("sectionHeader.title", { ns: DEVICE_TRANSLATION_NAMESPACE })} 
            description={t("sectionHeader.description", { ns: DEVICE_TRANSLATION_NAMESPACE })} 
          />

          <div className="flex flex-wrap gap-4">
            <DeviceTableFilters searchBy={metadata.searchBy} t={t} />
          </div>
          <div className="w-full overflow-x-auto">
            <DevicesTable
              devices={devices}
              isLoading={isDevicesDataLoading}
              handleShowDevice={handleShowPopupOpen}
              handleEditDevice={handleEditPopupOpen}
              handleDeleteDevice={handleDeletePopupOpen}
              t={t}
            />
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isDevicesDataLoading}
            onClickFirst={() => setFilters({ page: 1 })}
            onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
            onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
          />
        </div>
      </div>

      <AddDevicePopup
        isOpen={isAddPopupOpen}
        formInputs={renderDeviceInputs}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        handleClose={() => setIsAddPopupOpen(false)}
        isLoading={isAdding}
        t={t}
      />

      <EditDevicePopup
        isOpen={isEditPopupOpen} 
        handleClose={handleEditPopupClose} 
        isLoading={isUpdating} 
        handleSubmit={handleSubmit(handleConfirmUpdate)} 
        formInputs={renderDeviceInputs} 
        t={t}
      />

      <DeleteDevicePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />

      <ShowDevicePopup
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)} 
        handleDeletePopupOpen={() => {
          handleDeletePopupOpen(selectedID)
        }}
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID)
          setIsShowPopupOpen(false)
        }}
        device={device}
        isLoading={isDeviceDataLoading}
        t={t}
      />
    </>
  )
}

export default ManageDevicesPage