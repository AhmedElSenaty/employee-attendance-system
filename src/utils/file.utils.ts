import { IFileData } from "../interfaces";

/**
 * Checks if the given file is an image based on its MIME type.
 *
 * @param file - The file to check.
 * @returns `true` if the file is an image, otherwise `false`.
 *
 * @example
 * const isImage = isImageFile(fileInput.files?.[0]);
 */
export const isImageFile = (file: File | null) => file && file.type.startsWith("image/");

/**
 * Triggers a download in the browser for a base64-encoded file.
 *
 * @param fileData - An object containing the base64 content, file type, and download name.
 *
 * @example
 * downloadFile({
 *   fileContents: "UEsDBBQAAAA...",
 *   contentType: "application/zip",
 *   fileDownloadName: "report.zip"
 * });
 */
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
