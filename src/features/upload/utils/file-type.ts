export const isPdfUploadFile = (file: File) =>
  file.type === "application/pdf" && file.name.toLowerCase().endsWith(".pdf");

export const isSupportedUploadFile = (file: File, maxFileSize: number) =>
  isPdfUploadFile(file) && file.size <= maxFileSize;
