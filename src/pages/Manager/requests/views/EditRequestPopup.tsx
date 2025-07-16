import { useTranslation } from "react-i18next";
import {
  Button,
  CustomSelect,
  Field,
  Input,
  InputErrorMessage,
  Label,
  Popup,
  Textarea,
} from "../../../../components/ui";
import { useEditRequest, useGetRequestById } from "../../../../hooks/request.hook";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "lucide-react";
import { LeaveType } from "../../../../enums/requestTypes.enum";
import { editRequestSchema, EditRequestFormValues } from "../../../../validation/request.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect as useReactEffect } from "react";

interface IEditRequestPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  requestId: number;
}

const EditRequestPopup = ({ isOpen, handleClose, requestId }: IEditRequestPopupProps) => {
  const { t } = useTranslation("requests");

  const { request, isLoading } = useGetRequestById(requestId);

const leaveTypeOptions = Object.entries(LeaveType)
  .filter(([, value]) =>
    typeof value === "number" &&
    (value === LeaveType.HalfDayMission || value === LeaveType.FullDayMission)
  )
  .map(([key, value]) => ({
    value: value as number,
    label: t(`inputs.leaveType.options.${key}`),
  }));
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<EditRequestFormValues>({
    resolver: yupResolver(editRequestSchema),
    defaultValues: {
      requestId,
      leaveType: undefined,
      startDate: "",
      endDate: "",
      comment: "",
    },
  });

  // Watch leaveType to conditionally render
  const selectedLeaveType = watch("leaveType");

  useReactEffect(() => {
    if (request && isOpen) {
      reset({
        requestId: request.requestId,
        leaveType: request.leaveType,
        startDate: request.startDate.split("T")[0],
        endDate: request.endDate.split("T")[0],
        comment: request.comment ?? "",
      });
    }
  }, [request, reset, isOpen]);

  const { mutate, isPending } = useEditRequest();

  const onSubmit = (data: EditRequestFormValues) => {
    data.requestId = requestId;
    mutate(data, {
      onSuccess: () => {
        reset();
        handleClose();
      },
    });
  };

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("editPopup.title")}
      description={t("editPopup.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* ✅ Only show if current type is Mission */}
{(selectedLeaveType === LeaveType.FullDayMission || selectedLeaveType === LeaveType.HalfDayMission) && (
  <Field className="space-y-2">
    <Label size="lg">{t("inputs.leaveType.label")}</Label>
    <Controller
      name="leaveType"
      control={control}
      render={({ field }) => (
        <CustomSelect
          className="w-full"
          options={leaveTypeOptions}
          value={
            leaveTypeOptions.find((opt) => opt.value === field.value) || null
          }
          onChange={(option) => field.onChange(option?.value)}
          error={!!errors.leaveType}
          isSearchable
        />
      )}
    />
    {errors.leaveType && (
      <InputErrorMessage>
        {t(`inputs.leaveType.validation.${errors.leaveType?.type}`)}
      </InputErrorMessage>
    )}
  </Field>
)}


        {/* Start Date */}
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.startDate.label")}</Label>
          <Input
            type="date"
            placeholder="YYYY-MM-DD"
            isError={!!errors.startDate}
            icon={<Calendar />}
            {...register("startDate")}
          />
          {errors.startDate && (
            <InputErrorMessage>
              {t(`inputs.startDate.validation.${errors.startDate?.type}`)}
            </InputErrorMessage>
          )}
        </Field>

        {/* End Date */}
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.endDate.label")}</Label>
          <Input
            type="date"
            placeholder="YYYY-MM-DD"
            isError={!!errors.endDate}
            icon={<Calendar />}
            {...register("endDate")}
          />
          {errors.endDate && (
            <InputErrorMessage>
              {t(`inputs.endDate.validation.${errors.endDate?.type}`)}
            </InputErrorMessage>
          )}
        </Field>

        {/* Comment */}
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.comment.label")}</Label>
          <Textarea
            placeholder={t("inputs.comment.placeholder")}
            {...register("comment")}
          />
        </Field>

        <div className="flex items-center space-x-3 mt-4">
          <Button variant="cancel" type="button" fullWidth onClick={handleClose}>
            {t("editPopup.buttons.cancel")}
          </Button>
          <Button type="submit" fullWidth isLoading={isPending || isLoading}>
            {t("editPopup.buttons.save")}
          </Button>
        </div>
      </form>
    </Popup>
  );
};

export default EditRequestPopup;
