import { useEffect, useState } from "react";
import { AlertTriangle, Bell, XCircle } from "lucide-react";
import { ILoginResponse, initialLoginResponse } from "../../../interfaces/loginInterfaces";
import { Alert } from "../../../components/ui/Alert";
import { TFunction } from "i18next";
import { countdownFrom, formatTime } from "../../../utils";

interface ILoginAlertsProps {
  responseData: ILoginResponse;
  t: TFunction
}

const LoginAlerts = ({ responseData, t }: ILoginAlertsProps) => {
  const { isLocked, isBlocked, attempts, lock } = responseData.data || initialLoginResponse.data
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    if (lock.remainingLockDuration) {
      countdownFrom(lock.remainingLockDuration, setCountdown);
    }
  }, [lock.remainingLockDuration]);


  return (
    <div>
      {/* Warning Alert with Children */}
      {!isLocked && attempts?.availableAttempts > 0 && (
        <Alert
          type="warning"
          icon={<AlertTriangle className="w-6 h-6" />}
          title={t("alerts.attemptsRemaining", { ns: "login" })}
        >
          <p>
            {t("messages.attemptsRemaining", { 
              ns: "login", 
              count: attempts?.availableAttempts ?? 0 
            })}
          </p>
        </Alert>
      )}

      {/* Account Blocked Alert */}
      {isBlocked && (
        <Alert
          type="default"
          icon={<Bell className="w-6 h-6" />}
          title={t("alerts.accountBlocked", { ns: "login" })}
        >
          <p>
            {t("messages.accountBlocked", { ns: "login", attemptCount: attempts?.attemptCount })}
          </p>
        </Alert>
      )}

      {/* Account Locked Alert */}
      {isLocked && attempts?.attemptCount > 0 && (
        <Alert
          type="error"
          icon={<XCircle className="w-6 h-6" />}
          title={t("alerts.accountLocked", { ns: "login" })}
        >
          <p>
            {t("messages.accountLocked", { ns: "login", time: formatTime(lock?.lockDuration ?? "00:00:00") })}
          </p>
          {isLocked && (
            <p className="text-center text-lg font-semibold">
              {t("messages.remainingTime", { ns: "login", time: countdown })}
            </p>
          )}
        </Alert>
      )}
    </div>
  );
};

export default LoginAlerts;
