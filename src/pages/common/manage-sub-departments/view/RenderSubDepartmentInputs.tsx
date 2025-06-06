import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Field, Input, InputErrorMessage, Label, SelectBox, SelectBoxSkeleton, Textarea } from "../../../../components/ui";
import { TFunction } from "i18next";
import { ISubDepartmentCredentials } from "../../../../interfaces";
import { useGetEntitiesList } from "../../../../hooks/useEntitiesHook";
import { useGetDepartmentsList } from "../../../../hooks/useDepartmentHook";
import { SUB_DEPARTMENT_TRANSLATION_NAMESPACE } from "..";

interface IRenderSubDepartmentInputsProps {
  register: UseFormRegister<ISubDepartmentCredentials>;
  errors: FieldErrors<ISubDepartmentCredentials>;
  t: TFunction;
  watch?: UseFormWatch<ISubDepartmentCredentials> | null; // Watch form values
}

const RenderSubDepartmentInputs = ({ register, errors, t, watch }: IRenderSubDepartmentInputsProps) => {
  const { entitiesList, entitiesListIsLoading } = useGetEntitiesList();
  const { departmentsList, isDepartmentsLoading } = useGetDepartmentsList();
  
  // Watch the value of the 'id' field
  const idValue = watch ? watch("id") : undefined;

  return (
    <>
      {/* Sub-Department #ID Field */}
      {!idValue && (
        <Field key="id" className="space-y-2">
          <Label size="lg">
            {t("form.id.label", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
          </Label>
          <Input
            type="number"
            placeholder={t("form.id.placeholder", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
            isError={!!errors.id}
            {...register("id")}
          />
          {errors.id && (
            <InputErrorMessage>
              {t(`form.id.inputValidation.${errors.id.type}`, { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
            </InputErrorMessage>
          )}
        </Field>
      )}
      
      {/* Sub-Department Name Field */}
      <Field key="name" className="space-y-2">
        <Label size="lg">
          {t("form.name.label", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
        </Label>
        <Input
          type="text"
          placeholder={t("form.name.placeholder", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
          isError={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <InputErrorMessage>
            {t(`form.name.inputValidation.${errors.name.type}`, { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Department ID Field */}
      <Field key="departmentID" className="space-y-2">
        <Label size="lg">
          {t("form.departmentID.label", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
        </Label>
        {isDepartmentsLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <SelectBox isError={!!errors.departmentID} {...register("departmentID")}>
            <option value="">Select department</option>
            {departmentsList?.map((department, idx) => (
              <option key={idx} value={department.id}>
                {department.name}
              </option>
            ))}
          </SelectBox>
        )}
        {errors.departmentID && (
          <InputErrorMessage>
            {t(`form.departmentID.inputValidation.${errors.departmentID.type}`, { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Entity ID Field */}
      <Field key="entityId" className="space-y-2">
        <Label size="lg">
          {t("form.entityId.label", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
        </Label>
        {entitiesListIsLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <SelectBox isError={!!errors.entityId} {...register("entityId")}>
            <option value="">Select entity</option>
            {entitiesList?.map((entity, idx) => (
              <option key={idx} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </SelectBox>
        )}
        {errors.entityId && (
          <InputErrorMessage>
            {t(`form.entityId.inputValidation.${errors.entityId.type}`, { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Description Field */}
      <Field key="description" className="space-y-2">
        <Label size="lg">
          {t("form.description.label", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
        </Label>
        <Textarea
          placeholder={t("form.description.placeholder", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
          isError={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <InputErrorMessage>
            {t(`form.description.inputValidation.${errors.description.type}`, { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default RenderSubDepartmentInputs;
