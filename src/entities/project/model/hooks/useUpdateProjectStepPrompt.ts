import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isCancel } from "axios";

import { getApiErrorMessage, toaster } from "@/shared";

import { updateProjectStepPromptAPI } from "../apis";
import { projectKeys } from "../constants";

export const useUpdateProjectStepPrompt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectStepPromptAPI,
    onSuccess: (prompt, { projectId, stepCode }) => {
      queryClient.setQueryData(
        projectKeys.stepPrompt(projectId, stepCode),
        prompt,
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
