import { useState } from "react";

import { toaster } from "@/shared";

import { UPLOAD_FILE_TYPE_LABEL } from "../constants";
import { isPdfUploadFile, isSupportedUploadFile } from "../utils";

export type UploadedFile = {
  id: string;
  file: File;
};

type Params = {
  maxFiles: number;
  maxFileSize: number;
};

type Result = {
  uploadedFiles: UploadedFile[];
  isDragging: boolean;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const useUploadFiles = ({ maxFiles, maxFileSize }: Params): Result => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) =>
      isSupportedUploadFile(file, maxFileSize),
    );
    const invalidTypeCount = newFiles.filter(
      (file) => !isPdfUploadFile(file),
    ).length;
    const oversizedFileCount = newFiles.filter(
      (file) => isPdfUploadFile(file) && file.size > maxFileSize,
    ).length;

    if (invalidTypeCount > 0) {
      toaster.create({
        type: "error",
        description: `${UPLOAD_FILE_TYPE_LABEL} 파일만 업로드할 수 있습니다.`,
      });
    }

    if (oversizedFileCount > 0) {
      const maxFileSizeInMb = maxFileSize / (1024 * 1024);

      toaster.create({
        type: "error",
        description: `PDF 파일은 개당 ${maxFileSizeInMb}MB를 초과할 수 없습니다.`,
      });
    }

    if (validFiles.length === 0) {
      return;
    }

    const remaining = maxFiles - uploadedFiles.length;

    if (remaining <= 0) {
      toaster.create({
        type: "warning",
        description: `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`,
      });
      return;
    }

    const toAdd = validFiles.slice(0, remaining);

    if (validFiles.length > remaining) {
      toaster.create({
        type: "warning",
        description: `최대 ${maxFiles}개까지만 업로드할 수 있어 일부 파일은 제외되었습니다.`,
      });
    }

    setUploadedFiles((prev) => [
      ...prev,
      ...toAdd.map((file) => ({ id: crypto.randomUUID(), file })),
    ]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) =>
      prev.filter((uploadedFile) => uploadedFile.id !== id),
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }

    e.target.value = "";
  };

  return {
    uploadedFiles,
    isDragging,
    addFiles,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
  };
};
