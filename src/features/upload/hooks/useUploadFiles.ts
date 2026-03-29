import { useState } from "react";

export type UploadedFile = {
  id: string;
  file: File;
};

type Params = {
  maxFiles: number;
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

export const useUploadFiles = ({ maxFiles }: Params): Result => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (newFiles: File[]) => {
    setUploadedFiles((prev) => {
      const remaining = maxFiles - prev.length;
      const toAdd = newFiles.slice(0, remaining);

      return [
        ...prev,
        ...toAdd.map((file) => ({ id: crypto.randomUUID(), file })),
      ];
    });
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
