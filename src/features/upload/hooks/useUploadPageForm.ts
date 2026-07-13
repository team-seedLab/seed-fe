import { useState } from "react";
import { useNavigate } from "react-router";

import {
  type AssignmentType,
  ROADMAP_TYPE_MAP,
  useCreateProject,
  useUploadFlowStore,
} from "@/entities";
import { ROUTE_PATHS } from "@/shared";

import { DEFAULT_UPLOAD_ASSIGNMENT_TYPE } from "../constants";

import { useUploadFiles } from "./useUploadFiles";

type Params = {
  maxFiles: number;
  maxFileSize: number;
};

type Result = {
  fields: {
    title: string;
    selectedType: AssignmentType;
    desiredOutcome: string;
    keyFocus: string;
    requiredElements: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setSelectedType: React.Dispatch<React.SetStateAction<AssignmentType>>;
    setDesiredOutcome: React.Dispatch<React.SetStateAction<string>>;
    setKeyFocus: React.Dispatch<React.SetStateAction<string>>;
    setRequiredElements: React.Dispatch<React.SetStateAction<string>>;
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
    startAnalysis: () => void;
  };
};

export const useUploadPageForm = ({
  maxFiles,
  maxFileSize,
}: Params): Result => {
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState<AssignmentType>(
    DEFAULT_UPLOAD_ASSIGNMENT_TYPE,
  );
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [keyFocus, setKeyFocus] = useState("");
  const [requiredElements, setRequiredElements] = useState("");

  const navigate = useNavigate();
  const {
    uploadedFiles,
    isDragging,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
  } = useUploadFiles({ maxFiles, maxFileSize });

  const { mutate: createProject, isPending } = useCreateProject();
  const reset = useUploadFlowStore((state) => state.reset);

  const canSubmit =
    title.trim().length > 0 &&
    (uploadedFiles.length > 0 ||
      [desiredOutcome, keyFocus, requiredElements].some(
        (value) => value.trim().length > 0,
      ));

  const startAnalysis = () => {
    if (!canSubmit || isPending) {
      return;
    }

    reset();
    createProject({
      title,
      roadmapType: ROADMAP_TYPE_MAP[selectedType],
      desiredOutcome,
      keyFocus,
      requiredElements,
      files: uploadedFiles.map((uploadedFile) => uploadedFile.file),
    });
    navigate(ROUTE_PATHS.UPLOAD_LOADING);
  };

  return {
    fields: {
      title,
      selectedType,
      desiredOutcome,
      keyFocus,
      requiredElements,
      setTitle,
      setSelectedType,
      setDesiredOutcome,
      setKeyFocus,
      setRequiredElements,
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
      startAnalysis,
    },
  };
};
