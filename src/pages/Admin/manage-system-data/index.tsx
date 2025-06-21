import { useTranslation } from "react-i18next";
import { Button, Header, InfoPopup } from "../../../components/ui";
import Inputs from "./views/Inputs";
import { SYSTEM_DATA_NS, SYSTEM_DATA_VIDEO } from "../../../constants";
import { useGetSystemData, useUpdateSystemData } from "../../../hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SystemDataFormValues, SystemDataSchema } from "../../../validation";
import { useEffect } from "react";
import { formatTimeHHMM } from "../../../utils";

const SystemDataPage = () => {
  const { t } = useTranslation([SYSTEM_DATA_NS]);

  const { systemData, isLoading: isSystemDataLoading } = useGetSystemData();

  const { mutate: updateSystemData, isPending: isUpdating } = useUpdateSystemData();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SystemDataFormValues>({
    resolver: yupResolver(SystemDataSchema),
    mode: "onChange",
    defaultValues: systemData,
  });

  // Reset form values when systemData changes (e.g. after fetch)
  useEffect(() => {
    if (systemData) {
      reset({
        ...systemData,
        max_time_To_attend: formatTimeHHMM(systemData.max_time_To_attend),
        min_time_To_Go: formatTimeHHMM(systemData.min_time_To_Go),
      });
    }
  }, [systemData, reset]);

  const onSubmit = (data: SystemDataFormValues) => {
    updateSystemData(data);
  };

  
  return (
    <div className="flex justify-center items-center py-10 sm:px-4 px-8">
      <div className="max-w-[1000px] space-y-10 drop-shadow-xl w-full">
        <Header
          heading={t("header.heading")}
          subtitle={t("header.subtitle")}
        />
        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopup.title")}
            description={t("infoPopup.description")}
            videoUrl={SYSTEM_DATA_VIDEO}
          />
        </div>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Inputs register={register} errors={errors} isLoading={isSystemDataLoading} />
          </div>
          <Button
            size="lg"
            variant="secondary"
            fullWidth
            isLoading={isSystemDataLoading || isUpdating}
            type="submit"
          >
            {(isSystemDataLoading || isUpdating)
              ? t("buttons.loading")
              : t("buttons.update")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SystemDataPage;
