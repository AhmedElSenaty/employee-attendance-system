import { useTranslation } from "react-i18next";
import { EMPLOYEE_PROFILE_NS } from "../../../../constants";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadProfileImageSchema } from "../../../../validation";
import { useUploadEmployeeImage } from "../../../../hooks";
import {
  Button,
  Description,
  Field,
  InputErrorMessage,
  Label
} from "../../../../components/ui";
import { FileInputPreview } from "../../../../components/ui/Form/FileUpload";

interface FormValues {
  profileImage: FileList;
}

const UpdateImageSection = () => {
  const { t } = useTranslation([EMPLOYEE_PROFILE_NS]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<FormValues>({
    resolver: yupResolver(uploadProfileImageSchema),
  });

  const profileImage = watch("profileImage") as FileList;

  const { mutate: uploadEmployeeImage, isPending: isUploadImageLoading } = useUploadEmployeeImage();

  const handleConfirmUpdate: SubmitHandler<FormValues> = ({ profileImage }) => {
    const file = profileImage?.[0];
    if (file) {
      uploadEmployeeImage(file);
      reset(); // Optional: reset form after upload
    }
  };

  return (
    <form className="max-w-sm mx-auto space-y-6" onSubmit={handleSubmit(handleConfirmUpdate)}>
      <h2 className="text-xl font-semibold text-center">{t("imageUpload.title")}</h2>

      <Field className="space-y-2">
        <Label size="lg">{t("form.profileImage.label")}</Label>
        <FileInputPreview
          {...register("profileImage")}
          isSelected={Boolean(profileImage?.length)}
          isError={!!errors.profileImage}
        />
        {profileImage?.[0] && (
          <a
            href={URL.createObjectURL(profileImage[0])}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-blue-600 hover:underline"
          >
            {t("form.profileImage.viewFileButton", "View Selected File")}
          </a>
        )}
        <Description>{t("form.profileImage.description")}</Description>
        {errors.profileImage && (
          <InputErrorMessage>
            {t(`form.profileImage.inputValidation.${errors.profileImage?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <div className="text-center">
        <Button type="submit" variant="secondary" isLoading={isUploadImageLoading}>
          {isUploadImageLoading ? 
            t("imageUpload.buttons.loading")
            : t("imageUpload.buttons.update")}
        </Button>
      </div>
    </form>
  );
};

export default UpdateImageSection;
