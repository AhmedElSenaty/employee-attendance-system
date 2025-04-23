import { IFileData } from "../interfaces";

export const isImageFile = (file: File | null) => file && file.type.startsWith("image/");

export const downloadFile = (fileData: IFileData) => {
  if (!fileData || !fileData.fileContents) {
    console.error("No file data available");
    return;
  }

  const byteCharacters = atob(fileData.fileContents);
  const byteNumbers = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const blob = new Blob([byteNumbers], { type: fileData.contentType });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", fileData.fileDownloadName || "report.zip");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}