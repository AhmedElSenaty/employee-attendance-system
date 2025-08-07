import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
  Textarea,
  TextareaSkeleton,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { ChangeVacationCountFormValues } from "../../../../validation/changeVacationCount.schema";
import { useUserStore } from "../../../../store";

interface Props {
  register: UseFormRegister<ChangeVacationCountFormValues>;
  errors: FieldErrors<ChangeVacationCountFormValues>;
  isLoading?: boolean;
}

const Inputs = ({ register, errors, isLoading = false }: Props) => {
  const { t } = useTranslation("changeVacationsRequests");
  const role = useUserStore((state) => state.role);
  if (isLoading) {
    return (
      <>
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="space-y-2">
          <LabelSkeleton />
          <TextareaSkeleton />
        </Field>
      </>
    );
  }

  return (
    <>
      {/* Total Casual & Available Casual */}
      <div className="grid grid-cols-2 gap-4">
        <Field className="space-y-2">
          <Label>{t("table.columns.totalCasual")}</Label>

          <Input
            type="number"
            isError={!!errors.totalCasual}
            {...register("totalCasual")}
            disabled={role === "admin"}
          />
          {errors.totalCasual && (
            <InputErrorMessage>
              {t(
                `inputs.totalCasual.inputValidation.${errors.totalCasual.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
        <Field className="space-y-2">
          <Label>{t("table.columns.availableCasual")}</Label>
          <Input
            type="number"
            isError={!!errors.availableCasual}
            {...register("availableCasual")}
            disabled={role === "admin"}
          />
          {errors.availableCasual && (
            <InputErrorMessage>
              {t(
                `inputs.availableCasual.inputValidation.${errors.availableCasual.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
      </div>

      {/* Total Ordinary & Available Ordinary */}
      <div className="grid grid-cols-2 gap-4">
        <Field className="space-y-2">
          <Label>{t("table.columns.totalOrdinary")}</Label>
          <Input
            type="number"
            isError={!!errors.totalOrdinary}
            {...register("totalOrdinary")}
            disabled={role === "admin"}
          />
          {errors.totalOrdinary && (
            <InputErrorMessage>
              {t(
                `inputs.totalOrdinary.inputValidation.${errors.totalOrdinary.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
        <Field className="space-y-2">
          <Label>{t("table.columns.availableOrdinary")}</Label>
          <Input
            type="number"
            isError={!!errors.availableOrdinary}
            {...register("availableOrdinary")}
            disabled={role === "admin"}
          />
          {errors.availableOrdinary && (
            <InputErrorMessage>
              {t(
                `inputs.availableOrdinary.inputValidation.${errors.availableOrdinary.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
      </div>

      {/* Total Leave Request & Available Leave Request */}
      <div className="grid grid-cols-2 gap-4">
        <Field className="space-y-2">
          <Label>{t("table.columns.totalLeaveRequest")}</Label>
          <Input
            type="number"
            isError={!!errors.totalLeaveRequest}
            {...register("totalLeaveRequest")}
            disabled={role === "admin"}
          />
          {errors.totalLeaveRequest && (
            <InputErrorMessage>
              {t(
                `inputs.totalLeaveRequest.inputValidation.${errors.totalLeaveRequest.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
        <Field className="space-y-2">
          <Label>{t("table.columns.availableLeaveRequest")}</Label>
          <Input
            type="number"
            isError={!!errors.availableLeaveRequest}
            {...register("availableLeaveRequest")}
            disabled={role === "admin"}
          />
          {errors.availableLeaveRequest && (
            <InputErrorMessage>
              {t(
                `inputs.availableLeaveRequest.inputValidation.${errors.availableLeaveRequest.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
      </div>

      {/* Manager Name */}
      <Field className="space-y-2">
        <Label>{t("table.columns.managerName")}</Label>
        <Input
          type="text"
          isError={!!errors.managerName}
          {...register("managerName")}
          disabled={role === "admin"}
        />
        {errors.managerName && (
          <InputErrorMessage>
            {t(`inputs.managerName.inputValidation.${errors.managerName.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Employee Name */}
      <Field className="space-y-2">
        <Label>{t("table.columns.emplyeeName")}</Label>
        <Input
          type="text"
          isError={!!errors.emplyeeName}
          {...register("emplyeeName")}
          disabled={role === "admin"}
        />
        {errors.emplyeeName && (
          <InputErrorMessage>
            {t(`inputs.emplyeeName.inputValidation.${errors.emplyeeName.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Description */}
      <Field className="space-y-2">
        <Label>{t("inputs.description.label")}</Label>
        <Textarea
          disabled={role === "admin"}
          placeholder={t("inputs.description.placeholder")}
          isError={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <InputErrorMessage>
            {t(`inputs.description.inputValidation.${errors.description.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Comment */}
      <Field className="space-y-2">
        <Label>{t("table.columns.comment")}</Label>
        <Textarea isError={!!errors.comment} {...register("comment")} />
        {errors.comment && (
          <InputErrorMessage>
            {t(`inputs.comment.inputValidation.${errors.comment.type}`)}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default Inputs;
