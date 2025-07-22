import { useTranslation } from "react-i18next";
import {
  Button,
  CustomSelect,
  Field,
  Input,
  InputErrorMessage,
  Label,
  Popup,
  SelectBoxSkeleton,
  Textarea,
} from "../../../../components/ui";
import { useAssignGenericeRequest } from "../../../../hooks/request.hook";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useGetEmployeesList } from "../../../../hooks";
import { EmployeeSummary } from "../../../../interfaces";
import { Calendar } from "lucide-react";
import { AssignGenericFormValues, assignGenericRequestSchema } from "../../../../validation/generic.schema";

interface IAssignPopupProps {
  isOpen: boolean;
  handleClose: () => void;
}

const AssignGenericPopup = ({ isOpen, handleClose }: IAssignPopupProps) => {
  const { t } = useTranslation("requests");
  const { employeesList, isLoading: isEmployeesListLoading } =
    useGetEmployeesList();

  const employeeOptions =
    employeesList?.map((employee: EmployeeSummary) => ({
      value: employee.id,
      label: employee.name,
    })) || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AssignGenericFormValues>({
    resolver: yupResolver(assignGenericRequestSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useAssignGenericeRequest();

  const onSubmit = (data: AssignGenericFormValues) => {
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
      title={t("assignPopup.title")}
      description={t("assignPopup.description")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Employee ID */}
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.employeeId.label")}</Label>
          {isEmployeesListLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <Controller
              name="employeeId"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  className="w-full"
                  options={employeeOptions}
                  value={
                    employeeOptions.find((opt) => opt.value === field.value) ||
                    null
                  }
                  onChange={(option) => field.onChange(option?.value)}
                  error={!!errors.employeeId}
                  isSearchable
                />
              )}
            />
          )}
          {errors.employeeId && (
            <InputErrorMessage>
              {t(
                `inputs.employeeId.inputValidation.${errors.employeeId?.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>

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

        {/* Description */}
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.description.label")}</Label>
          <Textarea
            placeholder={t("inputs.description.placeholder")}
            {...register("description")}
          />
        </Field>

        <div className="flex items-center space-x-3 mt-4">
          <Button
            variant="cancel"
            type="button"
            fullWidth={true}
            onClick={handleClose}
          >
            {t("assignPopup.buttons.close")}
          </Button>
          <Button type="submit" fullWidth={true} isLoading={isPending}>
            {t("assignPopup.buttons.accept")}
          </Button>
        </div>
      </form>
    </Popup>
  );
};

export default AssignGenericPopup;
