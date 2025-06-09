import { CalendarCheck } from "lucide-react";
import { NormalSpinner, Button, Popup } from "../../../../components/ui/";
import { useLanguageStore } from "../../../../store/language.store";
import { ILeaveRequestData } from "../../../../interfaces/leaveRequest.interfaces";
import { LeaveRequestStatusType, LeaveRequestTimeType } from "../../../../enums";

interface IShowLeaveRequestPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleEditPopupOpen: () => void;
  leaveRequest: ILeaveRequestData | null;
  isLoading: boolean;
}

const ShowLeaveRequestPopup = ({
  isOpen,
  handleClose,
  handleEditPopupOpen,
  leaveRequest,
  isLoading,
}: IShowLeaveRequestPopupProps) => {
  const { language } = useLanguageStore();

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title="Leave Request Details"
      description="Detailed information about the leave request"
    >
      {isLoading ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg flex items-center justify-center min-h-[100px]">
          <NormalSpinner />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-gray-200 p-4 rounded-full">
              <CalendarCheck size={80} className="text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              Leave on {new Date(leaveRequest?.date || "").toLocaleDateString(language === "ar" ? "ar-EG" : "en-CA")}
            </h2>
          </div>

          <div className="mt-6 space-y-4 divide-y divide-gray-300">
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">ID</span>
              <span className="text-gray-900 font-semibold">{leaveRequest?.id}</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">Requested At</span>
              <span className="text-gray-900 font-semibold">
                {new Date(leaveRequest?.requestedAt || "").toLocaleDateString(language === "ar" ? "ar-EG" : "en-CA")}
              </span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">Type</span>
              <span className="text-gray-900 font-semibold">{LeaveRequestTimeType[Number(leaveRequest?.type)]}</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">Status</span>
              <span className="text-gray-900 font-semibold">{LeaveRequestStatusType[Number(leaveRequest?.status)]}</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">Description</span>
              <span className="text-gray-900 font-semibold">{leaveRequest?.description}</span>
            </div>
            {leaveRequest?.comment && (
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">Comment</span>
                <span className="text-gray-900 font-semibold">{leaveRequest?.comment}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mt-4">
          <Button variant="info" type="button" fullWidth onClick={handleEditPopupOpen}>
            Edit
          </Button>
        <Button variant="cancel" type="button" fullWidth onClick={handleClose}>
          Close
        </Button>
      </div>
    </Popup>
  );
};

export default ShowLeaveRequestPopup;
