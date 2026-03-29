import { useState } from "react";
import { useNavigate } from "react-router";

import {
  type AssignmentType,
  ROADMAP_STEP_CODES,
  ROADMAP_TYPE_MAP,
  useCreateProject,
  useUploadFlowStore,
} from "@/entities";
import { ROUTE_PATHS } from "@/shared";

import { useUploadFiles } from "./useUploadFiles";

type Params = {
  initialSelectedType: AssignmentType;
  maxFiles: number;
};

type Result = {
  title: string;
  selectedType: AssignmentType;
  content: string;
  isDragging: boolean;
  isPending: boolean;
  canSubmit: boolean;
  stepCount: number;
  uploadedFiles: ReturnType<typeof useUploadFiles>["uploadedFiles"];
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setSelectedType: React.Dispatch<React.SetStateAction<AssignmentType>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  removeFile: ReturnType<typeof useUploadFiles>["removeFile"];
  handleDragOver: ReturnType<typeof useUploadFiles>["handleDragOver"];
  handleDragLeave: ReturnType<typeof useUploadFiles>["handleDragLeave"];
  handleDrop: ReturnType<typeof useUploadFiles>["handleDrop"];
  handleFileInput: ReturnType<typeof useUploadFiles>["handleFileInput"];
  startAnalysis: () => void;
};

export const useUploadPageForm = ({
  initialSelectedType,
  maxFiles,
}: Params): Result => {
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] =
    useState<AssignmentType>(initialSelectedType);
  const [content, setContent] = useState("");

  const navigate = useNavigate();
  const {
    uploadedFiles,
    isDragging,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
  } = useUploadFiles({ maxFiles });

  const { mutate: createProject, isPending } = useCreateProject();
  const reset = useUploadFlowStore((state) => state.reset);

  const canSubmit =
    title.trim().length > 0 &&
    (uploadedFiles.length > 0 || content.trim().length > 0);

  const stepCount = ROADMAP_STEP_CODES[ROADMAP_TYPE_MAP[selectedType]].length;

  const startAnalysis = () => {
    if (!canSubmit || isPending) {
      return;
    }

    reset();
    createProject({
      title,
      roadmapType: ROADMAP_TYPE_MAP[selectedType],
      userIntent: content,
      files: uploadedFiles.map((uploadedFile) => uploadedFile.file),
    });
    navigate(ROUTE_PATHS.UPLOAD_LOADING);
  };

  return {
    title,
    selectedType,
    content,
    isDragging,
    isPending,
    canSubmit,
    stepCount,
    uploadedFiles,
    setTitle,
    setSelectedType,
    setContent,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    startAnalysis,
  };
};
