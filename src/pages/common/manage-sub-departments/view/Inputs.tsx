import { Controller, FieldErrors, UseFormRegister, Control, UseFormWatch } from "react-hook-form";
import {
  CustomSelect,
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
  SelectBoxSkeleton,
  Textarea,
  TextareaSkeleton,
} from "../../../../components/ui";
import { useGetDepartmentsList, useGetEntitiesList } from "../../../../hooks/";
import { SubDepartmentFormValues } from "../../../../validation";
import { useTranslation } from "react-i18next";
import { SUB_DEPARTMENT_NS } from "../../../../constants";
import { DepartmentSummary, EntitySummary } from "../../../../interfaces";

interface Props {
  register: UseFormRegister<SubDepartmentFormValues>;
  control: Control<SubDepartmentFormValues>;
  errors: FieldErrors<SubDepartmentFormValues>;
  watch?: UseFormWatch<SubDepartmentFormValues> | null;
  isLoading?: boolean
}

const Inputs = ({ register, control, errors, watch, isLoading = false }: Props) => {
  const { t } = useTranslation([SUB_DEPARTMENT_NS]);

  const { entitiesList, isLoading: entitiesListIsLoading } = useGetEntitiesList();
  const { departmentsList, isLoading: isDepartmentsLoading } = useGetDepartmentsList();

  const entityOptions =
    entitiesList?.map((entity: EntitySummary) => ({
      value: entity.id,
      label: entity.name,
    })) || [];

  const departmentOptions =
    departmentsList?.map((department: DepartmentSummary) => ({
      value: department.id,
      label: department.name,
    })) || [];

  const idValue = watch ? watch("id") : undefined;

  if (isLoading) {
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <Field key={i} className="space-y-2">
            <LabelSkeleton />
            <InputSkeleton />
          </Field>
        ))}
        <Field className="space-y-2">
          <LabelSkeleton />
          <TextareaSkeleton />
        </Field>
      </>
    );
  }

  return (
    <>
      {!idValue && (
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.id.label")}</Label>
          <Input
            type="number"
            placeholder={t("inputs.id.placeholder")}
            isError={!!errors.id}
            {...register("id")}
          />
          {errors.id && (
            <InputErrorMessage>
              {t(`inputs.id.inputValidation.${errors.id.type}`)}
            </InputErrorMessage>
          )}
        </Field>
      )}

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.name.label")}</Label>
        <Input
          type="text"
          placeholder={t("inputs.name.placeholder")}
          isError={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <InputErrorMessage>
            {t(`inputs.name.inputValidation.${errors.name.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.departmentID.label")}</Label>
        {isDepartmentsLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <Controller
            name="departmentID"
            control={control}
            render={({ field }) => (
              <CustomSelect
                className="w-full"
                options={departmentOptions}
                value={departmentOptions.find((opt: {value: number, label: string}) => opt.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value)}
                error={!!errors.departmentID}
              />
            )}
          />
        )}
        {errors.departmentID && (
          <InputErrorMessage>
            {t(`inputs.departmentID.inputValidation.${errors.departmentID.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.entityId.label")}</Label>
        {entitiesListIsLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <Controller
            name="entityId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                className="w-full"
                options={entityOptions}
                value={entityOptions.find((opt: {value: number, label: string}) => opt.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value)}
                error={!!errors.entityId}
              />
            )}
          />
        )}
        {errors.entityId && (
          <InputErrorMessage>
            {t(`inputs.entityId.inputValidation.${errors.entityId.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.description.label")}</Label>
        <Textarea
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
    </>
  );
};

export default Inputs;
