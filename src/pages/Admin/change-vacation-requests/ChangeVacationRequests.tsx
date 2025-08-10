import {
  Header,
  SectionHeader,
  Paginator,
  InfoPopup,
} from "../../../components/ui/";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useCreateEntity, useDebounce } from "../../../hooks/";
import { ENTITY_VIDEO } from "../../../constants";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";

import {
  useAccept,
  useGetByID,
  useGetChangeVacationRequests,
  useReject,
  useUpdate,
} from "../../../hooks/changeVacationCount.hooks";
import {
  changeVacationCountSchema,
  ChangeVacationCountFormValues,
} from "../../../validation/changeVacationCount.schema";
import ChangeVacationTable from "./views/ChangeVacationTable";
import ShowPopup from "./views/ShowPopup";
import EditPopup from "./views/EditPopup";
import Inputs from "./views/Inputs";
import AcceptPopup from "./views/AcceptPopup";
import RejectPopup from "./views/RejectPopup";
import TableFilters from "./views/TableFilter";

const ManageChangeVacationRequestsPage = () => {
  const { t } = useTranslation("changeVacationsRequests");

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
  } = useForm<ChangeVacationCountFormValues>({
    resolver: yupResolver(changeVacationCountSchema),
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
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsShowPopupOpen(true);
  };

  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsEditPopupOpen(true);
  };

  const handleDeletePopupOpen = (id: number) => {
    setSelectedID(id);
    setIsDeletePopupOpen(true);
  };

  const handleRejectPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsRejectPopupOpen(true);
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
    requests,
    metadata,
    isLoading: isEntitiesDataLoading,
  } = useGetChangeVacationRequests(page, pageSize, searchKey, searchQuery);

  const { entity, isLoading: isEntityDataLoading } = useGetByID(
    selectedID,
    resetEditInputs
  );

  const { mutate: updateEntity, isPending: isUpdating } = useUpdate();
  const { mutate: deleteEntity, isPending: isDeleting } = useAccept();
  const { mutate: reject, isPending: isRejecting } = useReject();

  const handleConfirmUpdate: SubmitHandler<ChangeVacationCountFormValues> = (
    request
  ) => {
    console.log(request);
    updateEntity(request);
    setIsEditPopupOpen(false);
  };
  const handleConfirmAccept = () => {
    if (!selectedID) return;
    deleteEntity(selectedID);
    setIsDeletePopupOpen(false);
    setIsShowPopupOpen(false);
  };

  const handleConfirmReject = () => {
    if (!selectedID) return;
    reject(selectedID);
    setIsRejectPopupOpen(false);
    setIsShowPopupOpen(false);
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />

      <div className="w-full flex items-center justify-center">
        <InfoPopup
          title={t("infoPopup.title")}
          description={t("infoPopup.description")}
          videoUrl={ENTITY_VIDEO}
        />
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
          handleAccept={handleDeletePopupOpen}
          handleReject={handleRejectPopupOpen}
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
          handleDeletePopupOpen(selectedID);
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
          />
        }
      />

      <AcceptPopup
        isOpen={isDeletePopupOpen}
        handleClose={() => {
          setIsDeletePopupOpen(false);
        }}
        handleConfirmAccept={handleConfirmAccept}
        isLoading={isDeleting}
      />

      <RejectPopup
        isOpen={isRejectPopupOpen}
        handleClose={() => {
          setIsRejectPopupOpen(false);
        }}
        handleConfirmReject={handleConfirmReject}
        isLoading={isRejecting}
      />
    </div>
  );
};

export default ManageChangeVacationRequestsPage;
