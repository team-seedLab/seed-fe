import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isCancel } from "axios";

import { getApiErrorMessage, toaster } from "@/shared";

import { saveProjectStepResultAPI } from "../apis";
import { projectKeys } from "../constants";

export const useSaveProjectStepResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProjectStepResultAPI,
    onSuccess: (result, { projectId, stepCode }) => {
      queryClient.setQueryData(
        projectKeys.stepResult(projectId, stepCode),
        result,
      );
    },
    onError: (error) => {
      if (isCancel(error)) {
        return;
      }

      toaster.create({
        type: "error",
        description: getApiErrorMessage(error),
      });
    },
  });
};
