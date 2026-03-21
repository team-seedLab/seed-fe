import { useMutation } from "@tanstack/react-query";

import { getApiErrorMessage, toaster } from "@/shared";

import { createProjectAPI } from "../apis";
import { useUploadFlowStore } from "../store";

export const useCreateProject = () => {
  const setProjectId = useUploadFlowStore((state) => state.setProjectId);
  const setError = useUploadFlowStore((state) => state.setError);

  return useMutation({
    mutationFn: createProjectAPI,
    onSuccess: (data) => {
      setProjectId(data.projectId);
    },
    onError: (error) => {
      toaster.create({
        type: "error",
        description: getApiErrorMessage(error),
      });
      setError(error instanceof Error ? error : new Error(String(error)));
    },
  });
};
