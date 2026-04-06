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

import { DEFAULT_UPLOAD_ASSIGNMENT_TYPE } from "../constants";

import { useUploadFiles } from "./useUploadFiles";

type Params = {
  maxFiles: number;
};

type Result = {
  fields: {
    title: string;
    selectedType: AssignmentType;
    content: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setSelectedType: React.Dispatch<React.SetStateAction<AssignmentType>>;
    setContent: React.Dispatch<React.SetStateAction<string>>;
  };
  files: {
    uploadedFiles: ReturnType<typeof useUploadFiles>["uploadedFiles"];
    isDragging: boolean;
    removeFile: ReturnType<typeof useUploadFiles>["removeFile"];
    handleDragOver: ReturnType<typeof useUploadFiles>["handleDragOver"];
    handleDragLeave: ReturnType<typeof useUploadFiles>["handleDragLeave"];
    handleDrop: ReturnType<typeof useUploadFiles>["handleDrop"];
    handleFileInput: ReturnType<typeof useUploadFiles>["handleFileInput"];
  };
  submit: {
    isPending: boolean;
    canSubmit: boolean;
    stepCount: number;
    startAnalysis: () => void;
  };
};

export const useUploadPageForm = ({ maxFiles }: Params): Result => {
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState<AssignmentType>(
    DEFAULT_UPLOAD_ASSIGNMENT_TYPE,
  );
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
    fields: {
      title,
      selectedType,
      content,
      setTitle,
      setSelectedType,
      setContent,
    },
    files: {
      uploadedFiles,
      isDragging,
      removeFile,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleFileInput,
    },
    submit: {
      isPending,
      canSubmit,
      stepCount,
      startAnalysis,
    },
  };
};
