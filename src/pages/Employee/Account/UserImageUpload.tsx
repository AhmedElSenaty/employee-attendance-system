import { useState, FormEvent } from "react";
import { ImageIcon, CheckCircle2 } from "lucide-react";
import { FileUpload } from "../../../components/ui/Form";
import { Button } from "../../../components/ui/Button";
import { showToast } from "../../../utils";
import { useTranslation } from "react-i18next";
import { useFetchMe, useUploadEmployeeImage } from "../../../hooks/me.hooks";

const TRANSLATION_NAMESPACE = "empolyeeAccount";

const validateUserImage = (file: File): string | null => {
  const allowedExtensions = [".jpg", ".jpeg"];
  const maxSizeInMB = 1;
  
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const fileSizeInMB = file.size / (1024 * 1024);
  
  if (!fileExtension || !allowedExtensions.includes(`.${fileExtension}`)) {
    return "Only JPG and JPEG files are allowed.";
  }
  
  if (fileSizeInMB > maxSizeInMB) {
    return "File size must not exceed 1MB.";
  }
  
  return null;
};

const UserImageUploadForm = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: uploadEmployeeImage, isPending: isUploadImageLoading } = useUploadEmployeeImage();
  const { me } = useFetchMe();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      showToast("error", t("imageUpload.noFileSelected", { ns: TRANSLATION_NAMESPACE }));
      return;
    }
    
    if (!me?.id) {
      showToast("error", t("imageUpload.userMissing", { ns: TRANSLATION_NAMESPACE }));
      return;
    }
    
    uploadEmployeeImage(selectedFile);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-center">{t("imageUpload.title", { ns: TRANSLATION_NAMESPACE })}</h2>

      <FileUpload
        name="profileImage"
        onFileSelect={setSelectedFile}
        accept=".jpg,.jpeg"
        icon={<ImageIcon className="w-full h-full text-[#19355a]" />}
        successIcon={<CheckCircle2 className="w-full h-full text-green-500" />}
        validateFile={validateUserImage}
      />

      {selectedFile && (
        <div className="text-sm text-gray-700 text-center">
          <p><strong>{t("imageUpload.file", { ns: TRANSLATION_NAMESPACE })}:</strong> {selectedFile.name}</p>
          <p><strong>{t("imageUpload.size", { ns: TRANSLATION_NAMESPACE })}:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      <div className="text-center">
        <Button type="submit" variant="secondary" disabled={isUploadImageLoading}>
          {t("imageUpload.button", { ns: TRANSLATION_NAMESPACE })}
        </Button>
      </div>
    </form>
  );
};

export default UserImageUploadForm;
