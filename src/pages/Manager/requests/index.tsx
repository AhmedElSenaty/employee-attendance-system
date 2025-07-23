import { useTranslation } from "react-i18next";
import {
  Button,
  Header,
  NoDataMessage,
  StatusBadge,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  Tooltip,
} from "../../../components/ui";
import {
  useAcceptRequest,
  useGetRequests,
  useRejectRequest,
  useSoftDeleteRequest,
} from "../../../hooks/request.hook";
import { useLanguageStore } from "../../../store";
import {
  IRejectRequestCredentials,
  IRequest,
  ISoftDeleteRequestCredentials,
} from "../../../interfaces/request.interfaces";
import { getRequestStatusVariant } from "../../../utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HasPermission } from "../../../components/auth";
import { RequestStatusType } from "../../../enums";
import { Check, X } from "lucide-react";
import RejectPopup from "./views/RejectPopup";
import AcceptPopup from "./views/AcceptPopup";
import DeletePopup from "./views/DeletePopup";

const RequestsPage = () => {
  const { requests, isLoading } = useGetRequests();
  const { t } = useTranslation("requests");
  const { language } = useLanguageStore();
  const [isAcceptPopupOpen, setIsAcceptPopupOpen] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedID, setSelectedID] = useState<number>(0);

  const { register, handleSubmit, reset } =
    useForm<IRejectRequestCredentials>();
  const {
    register: registerDelete,
    handleSubmit: handleSubmitDelete,
    reset: restDelete,
    formState: { errors: deleteErrors },
  } = useForm<ISoftDeleteRequestCredentials>();

  const { mutate: acceptSickRequest, isPending: isAccepting } =
    useAcceptRequest();
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectRequest();
  const { mutate: deleteRequest, isPending: isDeleting } =
    useSoftDeleteRequest();

  const REQUESTS_TABLE_COLUMNS = [
    // "table.columns.id",
    "table.columns.employeeName",
    "table.columns.startDate",
    "table.columns.endDate",
    "table.columns.startTime",
    "table.columns.endTime",
    "table.columns.requestType",
    "table.columns.requestStatus",
    "table.columns.requestAt",
    "table.columns.actions",
  ];
  const columns = REQUESTS_TABLE_COLUMNS.map((key) => t(key));

  const handleAcceptPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsAcceptPopupOpen(true);
  };

  const handleRejectPopupOpen = (id: number) => {
    setSelectedID(id);
    reset();
    setIsRejectPopupOpen(true);
  };

  const handleRejectPopupClose = () => {
    setSelectedID(0);
    reset();
    setIsRejectPopupOpen(false);
  };
  // const handleDeletePopupOpen = (id: number) => {
  //   setSelectedID(id);
  //   restDelete();
  //   setIsDeletePopupOpen(true);
  // };

  const handleDeletePopupClose = () => {
    setSelectedID(0);
    restDelete();
    setIsDeletePopupOpen(false);
  };

  const handleConfirmAccept = () => {
    acceptSickRequest(selectedID);
    setIsAcceptPopupOpen(false);
  };

  const handleConfirmReject = handleSubmit(
    (request: IRejectRequestCredentials) => {
      rejectRequest({ id: String(selectedID), data: request });
      setIsRejectPopupOpen(false);
    }
  );
  const handleConfirmDelete = handleSubmitDelete(
    (request: ISoftDeleteRequestCredentials) => {
      request.requestId = selectedID;
      deleteRequest(request);
      setIsDeletePopupOpen(false);
    }
  );

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <div className="w-full overflow-x-auto">
            {isLoading ? (
              <TableSkeleton
                numberOfColumns={columns.length}
                defaultNumberOfRows={5}
              />
            ) : (
              <Table columns={columns}>
                {requests.length === 0 ? (
                  <NoDataMessage
                    title={t("table.emptyTable.title")}
                    message={t("table.emptyTable.message")}
                  />
                ) : (
                  requests.map((request: IRequest) => (
                    <TableRow key={request.id} className="border-b">
                      {/* <TableCell
                       label={columns[0]}>{request?.id}
                       </TableCell> */}

                      <TableCell label={columns[0]}>
                        {request.employeeName}
                      </TableCell>

                      <TableCell label={columns[1]}>
                        {new Date(request.startDate).toLocaleDateString(
                          language
                        )}
                      </TableCell>

                      <TableCell label={columns[2]}>
                        {new Date(request.endDate).toLocaleDateString(language)}
                      </TableCell>

                      <TableCell label={columns[3]}>
                        {new Date(request.startDate).toLocaleTimeString(
                          language,
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>

                      <TableCell label={columns[4]}>
                        {new Date(request.endDate).toLocaleTimeString(
                          language,
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>

                      <TableCell label={columns[5]}>
                        {t(`leaveType.${request.leaveType}`)}
                      </TableCell>

                      <TableCell label={columns[6]}>
                        <StatusBadge
                          variant={getRequestStatusVariant(
                            request.requestStatus
                          )}
                          size="medium"
                          shape="rounded"
                        >
                          {t(`status.${request.requestStatus}`)}
                        </StatusBadge>
                      </TableCell>

                      <TableCell label={columns[7]}>
                        {new Date(request.requestedDate).toLocaleString(
                          language === "ar" ? "ar-EG" : "en-CA",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>

                      <TableCell label={columns[8]}>
                        <HasPermission permission="Accept/Reject Requests">
                          {request.requestStatus ===
                            RequestStatusType.Pending && (
                            <div className="flex gap-2">
                              <Tooltip
                                content={t("table.buttons.toolTipAccept")}
                              >
                                <Button
                                  variant="success"
                                  fullWidth={false}
                                  size={"sm"}
                                  icon={<Check className="w-full h-full" />}
                                  onClick={() =>
                                    handleAcceptPopupOpen(request.id)
                                  }
                                />
                              </Tooltip>

                              <Tooltip
                                content={t("table.buttons.toolTipReject")}
                              >
                                <Button
                                  variant="danger"
                                  fullWidth={false}
                                  size={"sm"}
                                  icon={<X className="w-full h-full" />}
                                  onClick={() =>
                                    handleRejectPopupOpen(request.id)
                                  }
                                />
                              </Tooltip>

                              {/* <Tooltip
                                content={t("table.buttons.toolTipDelete")}
                              >
                                <Button
                                  variant="error"
                                  fullWidth={false}
                                  size={"sm"}
                                  icon={<Trash className="w-full h-full" />}
                                  onClick={() =>
                                    handleDeletePopupOpen(request.id)
                                  }
                                />
                              </Tooltip> */}
                            </div>
                          )}
                        </HasPermission>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Accept & Reject Popups */}
      <AcceptPopup
        isOpen={isAcceptPopupOpen}
        handleConfirmAccept={handleConfirmAccept}
        isLoading={isAccepting}
        handleClose={() => setIsAcceptPopupOpen(false)}
      />
      <RejectPopup
        register={register}
        handleConfirmReject={handleConfirmReject}
        isLoading={isRejecting}
        isOpen={isRejectPopupOpen}
        handleClose={handleRejectPopupClose}
      />
      <DeletePopup
        register={registerDelete}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        isOpen={isDeletePopupOpen}
        handleClose={handleDeletePopupClose}
        errors={deleteErrors} // ✅ Add this line
      />
    </>
  );
};

export default RequestsPage;
