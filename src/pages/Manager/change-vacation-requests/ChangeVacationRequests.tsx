import {
  Header,
  SectionHeader,
  Paginator,
  InfoPopup,
  Button,
  ActionCard,
} from "../../../components/ui/";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useDebounce } from "../../../hooks/";
import { ENTITY_VIDEO } from "../../../constants";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";

import {
  useCreateChangeVacationRequest,
  useGetByID,
  useGetChangeVacationRequests,
  useUpdate,
} from "../../../hooks/changeVacationCount.hooks";
import {
  changeVacationCountSchema,
  ChangeVacationCountFormValues,
  AddChangeVacationCountFormValues,
  AddchangeVacationCountSchema,
} from "../../../validation/changeVacationCount.schema";
import ChangeVacationTable from "./views/ChangeVacationTable";
import ShowPopup from "./views/ShowPopup";
import Inputs from "./views/Inputs";
import TableFilters from "./views/TableFilter";
import AddInputs from "./views/Inputs";
import EditPopup from "./views/EditPopup";
import { CirclePlus } from "lucide-react";

const ManageChangeVacationRequestsPage = () => {
  const { t } = useTranslation("changeVacationsRequests");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
    setValue: setValueAdd,
  } = useForm<AddChangeVacationCountFormValues>({
    resolver: yupResolver(AddchangeVacationCountSchema),
    mode: "onChange",
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEditInputs,
  } = useForm<ChangeVacationCountFormValues>({
    resolver: yupResolver(changeVacationCountSchema),
    mode: "onChange",
  });

  const [selectedID, setSelectedID] = useState<number>(0);
  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsShowPopupOpen(true);
  };

  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsEditPopupOpen(true);
  };

  // const handleDeletePopupOpen = (id: number) => {
  //   setSelectedID(id);
  //   setIsDeletePopupOpen(true);
  // };

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
    requests,
    metadata,
    isLoading: isEntitiesDataLoading,
  } = useGetChangeVacationRequests(page, pageSize, searchKey, searchQuery);

  const { entity, isLoading: isEntityDataLoading } = useGetByID(
    selectedID,
    resetEditInputs
  );

  const { mutate: addEntity, isPending: isAdding } =
    useCreateChangeVacationRequest();
  const { mutate: updateEntity, isPending: isUpdating } = useUpdate();

  const handleConfirmAdd: SubmitHandler<AddChangeVacationCountFormValues> = (
    request
  ) => {
    addEntity(request);
    setIsAddPopupOpen(false);
  };

  const handleConfirmUpdate: SubmitHandler<ChangeVacationCountFormValues> = (
    request
  ) => {
    updateEntity(request);
    setIsEditPopupOpen(false);
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />

      <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopup.title")}
            description={t("infoPopup.description")}
            videoUrl={ENTITY_VIDEO}
          />
        </div>
        <ActionCard
          icon={<CirclePlus />}
          iconBgColor="bg-[#f5e4b2]"
          iconColor="text-[#b38e19]"
          title={t("addPopup.title")}
          description={t("addPopup.description")}
        >
          <Button
            fullWidth
            variant="secondary"
            onClick={() => setIsAddPopupOpen(true)}
          >
            {t("buttons.add")}
          </Button>
        </ActionCard>
      </div>
      {/* Right Column: Filters & Table */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader
          title={t("sectionsHeader.entitiesList.title")}
          description={t("sectionsHeader.entitiesList.description")}
        />

        {/* Filters */}
        <TableFilters
          searchBy={metadata.searchBy}
          getParam={getParam}
          setParam={setParam}
          clearParams={clearParams}
        />

        <ChangeVacationTable
          requests={requests}
          handleShow={handleShowPopupOpen}
          handleEdit={handleEditPopupOpen}
          isLoading={isEntitiesDataLoading}
        />

        {/* Pagination Component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isEntitiesDataLoading}
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

      <ShowPopup
        isOpen={isShowPopupOpen}
        handleClose={() => {
          setIsShowPopupOpen(false);
        }}
        handleDeletePopupOpen={() => {
          handleEditPopupOpen(selectedID);
        }}
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID);
          setIsShowPopupOpen(false);
        }}
        request={entity}
        isLoading={isEntityDataLoading}
      />

      <EditPopup
        isOpen={isEditPopupOpen}
        handleClose={() => {
          setSelectedID(0);
          setIsEditPopupOpen(false);
        }}
        isLoading={isUpdating}
        handleSubmit={handleSubmitEdit(handleConfirmUpdate)}
        formInputs={
          <Inputs
            register={registerEdit}
            errors={errorsEdit}
            isLoading={isEntityDataLoading}
            setValue={setValueAdd}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
            isEdit={true}
          />
        }
        mode="edit"
        selectedEmployeeId={selectedEmployeeId}
      />

      <EditPopup
        isOpen={isAddPopupOpen}
        handleClose={() => {
          setIsAddPopupOpen(false);
        }}
        isLoading={isAdding}
        handleSubmit={handleSubmitAdd(handleConfirmAdd)}
        formInputs={
          <AddInputs
            register={registerAdd}
            errors={errorsAdd}
            setValue={setValueAdd}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
            isEdit={false}
          />
        }
        selectedEmployeeId={selectedEmployeeId}
        mode="add"
      />
    </div>
  );
};

export default ManageChangeVacationRequestsPage;
