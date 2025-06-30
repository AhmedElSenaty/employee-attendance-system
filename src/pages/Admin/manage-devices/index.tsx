import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  CirclePlus,
  Fingerprint,
  LayoutGrid,
} from "lucide-react";
import { formatValue } from "../../../utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddPopup,
  DeletePopup,
  DevicesTable,
  DisconnectedDevicesTable,
  EditPopup,
  Inputs,
  ShowPopup,
  TableFilters,
} from "./views";
import { DeviceFormValues, deviceSchema } from "../../../validation";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/";
import {
  ActionCard,
  Button,
  CountCard,
  Header,
  InfoPopup,
  Paginator,
  SectionHeader,
} from "../../../components/ui";
import {
  useCreateDevice,
  useDeleteDevice,
  useGetDeviceByID,
  useGetDevices,
  useUpdateDevice,
  useDebounce,
} from "../../../hooks/";
import { DEVICES_NS, DEVICES_VIDEO } from "../../../constants";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";

const ManageDevicesPage = () => {
  const { t } = useTranslation([DEVICES_NS]);
  const { language } = useLanguageStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeviceFormValues>({
    resolver: yupResolver(deviceSchema),
    mode: "onChange",
  });

  const [selectedID, setSelectedID] = useState<number>(0);
  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsShowPopupOpen(true);
  };
  const handleAddPopupOpen = () => {
    setSelectedID(0);
    reset({ device_name: "", iP_Address: "", port: 4350 });
    setIsAddPopupOpen(true);
  };
  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsEditPopupOpen(true);
  };
  const handleEditPopupClose = () => {
    setSelectedID(0);
    reset();
    setIsEditPopupOpen(false);
  };
  const handleDeletePopupOpen = (id: number) => {
    setSelectedID(id);
    setIsDeletePopupOpen(true);
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
    devices,
    count,
    metadata,
    isLoading: isDevicesDataLoading,
  } = useGetDevices(page, pageSize, searchKey, searchQuery);

  const { device, isLoading: isDeviceDataLoading } = useGetDeviceByID(
    selectedID,
    reset
  );

  const renderDeviceInputs = (
    <Inputs
      register={register}
      errors={errors}
      isLoading={isDeviceDataLoading}
    />
  );

  const { mutate: addDevice, isPending: isAdding } = useCreateDevice();
  const { mutate: updateDevice, isPending: isUpdating } = useUpdateDevice();
  const { mutate: deleteDevice, isPending: isDeleting } = useDeleteDevice();

  /* ____________ HANDLER ____________ */
  const handleConfirmAdd: SubmitHandler<DeviceFormValues> = (request) => {
    addDevice(request);
    setIsAddPopupOpen(false);
  };
  const handleConfirmUpdate: SubmitHandler<DeviceFormValues> = (request) => {
    updateDevice(request);
    // setIsEditPopupOpen(false)
  };
  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteDevice(selectedID);
    setIsDeletePopupOpen(false);
    setIsShowPopupOpen(false);
  };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />

        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopup.title")}
            description={t("infoPopup.description")}
            videoUrl={DEVICES_VIDEO}
          />
        </div>

        <div className="max-w-[1000px] mx-auto space-y-6">
          <div className="flex justify-center">
            <CountCard
              title={t("CountCard.title")}
              description={t("CountCard.description")}
              count={formatValue(count, language)}
              icon={<Fingerprint size={28} />}
              bgColor="bg-[#b38e19]"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-1/2 h-fit">
              <HasPermission permission="Add Device">
                <ActionCard
                  icon={<CirclePlus />}
                  iconBgColor="bg-[#f5e4b2]"
                  iconColor="text-[#b38e19]"
                  title={t("addActionCard.title")}
                  description={t("addActionCard.description")}
                >
                  <Button
                    fullWidth={true}
                    variant="secondary"
                    onClick={handleAddPopupOpen}
                  >
                    {t("addActionCard.button")}
                  </Button>
                </ActionCard>
              </HasPermission>
            </div>
            <div className="w-full md:w-1/2 h-fit">
              {getParam("table") != "disconnectedDevices" ? (
                <ActionCard
                  icon={<AlertTriangle />}
                  iconBgColor="bg-[#ffe4e6]"
                  iconColor="text-[#d32f2f]"
                  title={t("disconnectedDevicesActionCard.title")}
                  description={t("disconnectedDevicesActionCard.description")}
                >
                  <Button
                    fullWidth={true}
                    variant="error"
                    onClick={() => {
                      setParam("table", "disconnectedDevices");
                    }}
                  >
                    {t("disconnectedDevicesActionCard.button")}
                  </Button>
                </ActionCard>
              ) : (
                <ActionCard
                  icon={<LayoutGrid />}
                  iconBgColor="bg-[#d7f0f6]"
                  iconColor="text-[#007fa4]"
                  title={t("allDevicesActionCard.title")}
                  description={t("allDevicesActionCard.description")}
                >
                  <Button
                    fullWidth={true}
                    onClick={() => setParam("table", "allDevices")}
                  >
                    {t("allDevicesActionCard.button")}
                  </Button>
                </ActionCard>
              )}
            </div>
          </div>
        </div>

        {getParam("table") == "disconnectedDevices" ? (
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader
              title={t("disconnectedDevicesSectionHeader.title")}
              description={t("disconnectedDevicesSectionHeader.description")}
            />
            <DisconnectedDevicesTable />
          </div>
        ) : (
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader
              title={t("sectionHeader.title")}
              description={t("sectionHeader.description")}
            />

            <TableFilters
              searchBy={metadata.searchBy}
              getParam={getParam}
              setParam={setParam}
              clearParams={clearParams}
            />

            <div className="w-full overflow-x-auto">
              <DevicesTable
                devices={devices}
                isLoading={isDevicesDataLoading}
                handleShow={handleShowPopupOpen}
                handleEdit={handleEditPopupOpen}
                handleDelete={handleDeletePopupOpen}
              />
            </div>

            {/* Pagination Component */}
            <Paginator
              page={metadata?.pagination?.pageIndex || 0}
              totalPages={metadata?.pagination?.totalPages || 1}
              totalRecords={metadata?.pagination?.totalRecords || 0}
              isLoading={isDevicesDataLoading}
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
        )}
      </div>

      <AddPopup
        isOpen={isAddPopupOpen}
        formInputs={renderDeviceInputs}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        handleClose={() => setIsAddPopupOpen(false)}
        isLoading={isAdding}
      />

      <EditPopup
        isOpen={isEditPopupOpen}
        handleClose={handleEditPopupClose}
        isLoading={isUpdating}
        handleSubmit={handleSubmit(handleConfirmUpdate)}
        formInputs={renderDeviceInputs}
      />

      <DeletePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => {
          setIsDeletePopupOpen(false);
        }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <ShowPopup
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)}
        handleDeletePopupOpen={() => {
          handleDeletePopupOpen(selectedID);
        }}
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID);
          setIsShowPopupOpen(false);
        }}
        device={device}
        isLoading={isDeviceDataLoading}
      />
    </>
  );
};

export default ManageDevicesPage;
