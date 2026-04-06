export const isPdfUploadFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

export const isImageUploadFile = (file: File) => file.type.startsWith("image/");

export const isSupportedUploadFile = (file: File) =>
  isPdfUploadFile(file) || isImageUploadFile(file);
