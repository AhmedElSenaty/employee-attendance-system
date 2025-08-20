import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Field,
  Label,
  Popup,
} from "../../../../components/ui";
import { FileCheck } from "lucide-react";
import { HasPermission } from "../../../../components/auth";
import useURLSearchParams from "../../../../hooks/URLSearchParams.hook";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleDownload: () => void;
  handleDownloadPDF: () => void;

  isLoading: boolean;
  isloadingPDF: boolean;

  //   includeDepartmentId: boolean;
  //   includeSubDeptartmentId: boolean;
}

const ExportVerificationPopup = ({
  isOpen,
  handleClose,
  handleDownload,
  isLoading,
  handleDownloadPDF,
  isloadingPDF,
}: Props) => {
  const { t } = useTranslation("requestsSummary");
  const { setParam } = useURLSearchParams();

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("exportPopup.title")}
      // description={t("exportPopup.description")}
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
        {/* Device Icon */}
        <div className="flex flex-col items-center space-y-3">
          <div className="bg-gray-200 p-4 rounded-full">
            <FileCheck size={80} className="text-gray-600" />
          </div>
        </div>

        {/* <Field className="flex space-x-2">
          <Checkbox
            onChange={(e) => {
              setParam("IncludeDepartment", String(e.target.checked));
            }}
          />
          <Label>{t("CheckBoxDept")}</Label>
        </Field> */}

        <Field className="flex space-x-2">
          <Checkbox
            onChange={(e) => {
              setParam("IncludeSubDepartment", String(e.target.checked));
            }}
          />
          <Label>{t("CheckBox")}</Label>
        </Field>
      </div>

      <div className="flex items-center space-x-3 mt-4">
        <Button
          variant="cancel"
          type="button"
          fullWidth={true}
          onClick={handleClose}
        >
          {t("buttons.close")}
        </Button>
        <HasPermission permission={"Export Employee Verification Report Excel"}>
          <Button
            variant="success"
            type="button"
            fullWidth={true}
            onClick={handleDownload}
            isLoading={isLoading}
          >
            {isLoading ? t("buttons.loading") : "Excel"}
          </Button>
        </HasPermission>

        <HasPermission permission={"Export Employee Verification Report PDF"}>
          <Button
            variant="success"
            type="button"
            fullWidth={true}
            onClick={handleDownloadPDF}
            isLoading={isloadingPDF}
          >
            {isloadingPDF ? t("buttons.loading") : "PDF"}
          </Button>
        </HasPermission>
      </div>
    </Popup>
  );
};

export default ExportVerificationPopup;
