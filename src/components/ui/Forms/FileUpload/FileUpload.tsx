import { useState, ChangeEvent, DragEvent, ReactNode } from "react";
import { isImageFile } from "../../../../utils";
import { useTranslation } from "react-i18next";

interface IProps {
  onFileSelect?: (file: File | null) => void;
  accept?: string;
  icon?: ReactNode;
  successIcon?: ReactNode;
  validateFile?: (file: File) => string | null;
  name: string
}


const FileUpload = ({ 
  onFileSelect, 
  accept = "", 
  icon, 
  successIcon, 
  validateFile,
  name = ""
}: IProps) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;
    
    const validationError = validateFile?.(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    setError(null);
    onFileSelect?.(selectedFile);
  };

  return (
    <div 
      className="flex justify-center rounded-lg border border-dashed border-[#19355a]/25 px-6 py-10 cursor-pointer"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="text-center">
        {file && isImageFile(file) ? (
          <img 
            src={URL.createObjectURL(file)} 
            alt="Preview" 
            className="mx-auto mb-4 h-24 w-24 object-cover rounded-lg"
          />
        ) : (
          <div className="mx-auto size-12 text-gray-300">
            {file ? successIcon : icon}
          </div>
        )}
        <div className="mt-4 flex text-lg text-gray-600">
          <label className="relative cursor-pointer rounded-lg bg-white font-semibold text-[#b38e19] focus-within:ring-2 focus-within:ring-[#b38e19] focus-within:ring-offset-2">
            <span>Upload a file</span>
            <input 
              type="file" 
              className="sr-only" 
              accept={accept} 
              onChange={handleFileChange} 
              name={name}
            />
          </label>
          <p className="pl-2">{t("fileUpload.dragAndDrop")}</p>
        </div>
        <p className="text-xs text-gray-600 mt-2">{t("fileUpload.allowedFiles", { accept: accept || "all" })}</p>
        {error && <p className="text-sm text-red-500 mt-2">{t("fileUpload.errorMessage", { error })}</p>}
        {file && !error && <p className="text-sm text-green-500 mt-2">{t("fileUpload.successMessage")}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
