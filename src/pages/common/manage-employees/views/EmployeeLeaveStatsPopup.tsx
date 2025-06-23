import { UserCheck2 } from "lucide-react";
import { NormalSpinner, Button, Popup } from "../../../../components/ui/";
import { useLanguageStore } from "../../../../store/";
import { EmployeeLeaveStats } from "../../../../interfaces";
import { useTranslation } from "react-i18next";
import { formatValue } from "../../../../utils";
import { EMPLOYEE_NS } from "../../../../constants";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  stats: EmployeeLeaveStats | null;
  isLoading: boolean;
}

const EmployeeLeaveStatsPopup = ({
  isOpen,
  handleClose,
  stats,
  isLoading,
}: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation(EMPLOYEE_NS);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("leaveStatsPopup.title")}
      description={t("leaveStatsPopup.description")}
    >
      {isLoading ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg flex items-center justify-center min-h-[100px]">
          <NormalSpinner />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-gray-200 p-4 rounded-full">
              <UserCheck2 size={80} className="text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {stats?.employeeName}
            </h2>
            <p className="text-sm text-gray-600">{stats?.departmentName}</p>
          </div>

          <div className="mt-6 space-y-4 divide-y divide-gray-300">
            {[
              { label: t("leaveStatsPopup.fields.totalOrdinaryLeaves"), value: stats?.totalOrdinaryLeaves },
              { label: t("leaveStatsPopup.fields.availableOrdinaryLeaves"), value: stats?.availableOrdinaryLeaves },
              { label: t("leaveStatsPopup.fields.totalCasualLeaves"), value: stats?.totalCasualLeaves },
              { label: t("leaveStatsPopup.fields.availableCasualLeaves"), value: stats?.availableCasualLeaves },
              { label: t("leaveStatsPopup.fields.totalLeaveRequests"), value: stats?.totalLeaveRequests },
              { label: t("leaveStatsPopup.fields.availableLeaveRequests"), value: stats?.availableLeaveRequests },
              { label: t("leaveStatsPopup.fields.totalSickLeave"), value: stats?.totalSickLeave },
              { label: t("leaveStatsPopup.fields.totalMissions"), value: stats?.totalMissions },
            ].map((item, idx) => (
              <div key={idx} className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{item.label}</span>
                <span className="text-gray-900 font-semibold">
                  {formatValue(item.value || 0, language)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center mt-4">
        <Button variant="cancel" type="button" fullWidth onClick={handleClose}>
          {t("buttons.close")}
        </Button>
      </div>
    </Popup>
  );
};

export default EmployeeLeaveStatsPopup;
