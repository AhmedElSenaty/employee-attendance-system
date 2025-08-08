import { useTranslation } from "react-i18next";
import { Signature } from "lucide-react";
import { PERMISSION_NS, PERMISSION_VIDEO } from "../../../../constants";
import { useLanguageStore } from "../../../../store";
import {
  CountCard,
  Header,
  InfoPopup,
  SectionHeader,
  Button,
} from "../../../../components/ui";
import { formatValue } from "../../../../utils";
import PermissionCheckboxes from "./PermissionCheckboxes";
import { useState } from "react";
import {
  useAddPermissionsToUsers,
  useGetPermissions,
  useRemovePermissionsToUsers,
} from "../../../../hooks";
// import { toast } from "react-hot-toast"; // if you use toasts

const AddOrRemoveFromAllUsers = () => {
  const { t } = useTranslation([PERMISSION_NS]);
  const language = useLanguageStore((state) => state.language);

  const { totalPermissions } = useGetPermissions();
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);

  const { mutate: addPermissions, isPending: isAdding } =
    useAddPermissionsToUsers();
  const { mutate: removePermissions, isPending: isRemoving } =
    useRemovePermissionsToUsers();

  const handleAddSelected = async () => {
    if (checkedPermissions.length === 0) return;

    addPermissions(checkedPermissions);
  };

  const handleRemoveSelected = async () => {
    if (checkedPermissions.length === 0) return;

    removePermissions(checkedPermissions);
  };

  return (
    <div className="sm:p-5 p-3 space-y-5 flex flex-col items-center">
      <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />

      <div className="w-full flex items-center justify-center">
        <InfoPopup
          title={t("infoPopup.title")}
          description={t("infoPopup.description")}
          videoUrl={PERMISSION_VIDEO}
        />
      </div>

      <div className="w-[500px] max-md:w-full">
        <CountCard
          title={t("CountCard.title")}
          description={t("CountCard.description")}
          count={formatValue(totalPermissions, language)}
          icon={<Signature size={28} />}
          bgColor="bg-[#b38e19]"
        />
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg w-full">
        <SectionHeader
          title={t("addRemovePage.permissionsSectionHeader.title")}
          description={t("addRemovePage.permissionsSectionHeader.description")}
        />

        <PermissionCheckboxes
          checked={checkedPermissions}
          setChecked={setCheckedPermissions}
        />

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="success"
            onClick={handleAddSelected}
            disabled={isAdding || checkedPermissions.length === 0}
            isLoading={isAdding}
          >
            {t("buttons.addAllToManagers", "Add All Selected")}
          </Button>

          <Button
            variant="danger"
            onClick={handleRemoveSelected}
            disabled={isRemoving || checkedPermissions.length === 0}
            isLoading={isRemoving}
          >
            {t("buttons.removeAllFromManagers", "Remove All Selected")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddOrRemoveFromAllUsers;
