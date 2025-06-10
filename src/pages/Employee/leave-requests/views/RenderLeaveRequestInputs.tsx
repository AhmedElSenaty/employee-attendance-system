import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
  SelectBox,
  Textarea,
  TextareaSkeleton,
} from "../../../../components/ui";
import { ILeaveRequestCredentials } from "../../../../interfaces/leaveRequest.interfaces";
import { LeaveRequestTimeType } from "../../../../enums";
import { Calendar } from "lucide-react";

interface ILeaveRequestInputsProps {
  register: UseFormRegister<ILeaveRequestCredentials>;
  errors: FieldErrors<ILeaveRequestCredentials>;
  isLoading?: boolean;
}

const RenderLeaveRequestInputs = ({ register, errors, isLoading }: ILeaveRequestInputsProps) => {
  return (
    <>
      {/* Leave Type */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">Leave Type</Label>
            <SelectBox {...register("type")} isError={!!errors.type} defaultValue="">
              <option value="" disabled>
                Select leave type
              </option>
                <option key={LeaveRequestTimeType.Morning} value={LeaveRequestTimeType.Morning}>
                  {LeaveRequestTimeType[0]}
                </option>
                <option key={LeaveRequestTimeType.Evening} value={LeaveRequestTimeType.Evening}>
                  {LeaveRequestTimeType[1]}
                </option>
            </SelectBox>
            {errors.type && (
              <InputErrorMessage>{errors.type.message}</InputErrorMessage>
            )}
          </>
        )}
      </Field>

      {/* Date */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">Date</Label>
            <Input
              type="date"
              placeholder="YYYY-MM-DD"
              isError={!!errors.date}
              icon={<Calendar />}
              {...register("date")}
              min={
                new Date(new Date().setDate(new Date().getDate()))
                .toISOString()
                .split("T")[0]
              }
            />
            {errors.date && (
              <InputErrorMessage>{errors.date.message}</InputErrorMessage>
            )}
          </>
        )}
      </Field>

      {/* Description */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <TextareaSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">Description</Label>
            <Textarea
              placeholder="Enter description"
              isError={!!errors.description}
              {...register("description")}
            />
            {errors.description && (
              <InputErrorMessage>{errors.description.message}</InputErrorMessage>
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default RenderLeaveRequestInputs;
