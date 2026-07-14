import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage, toaster } from "@/shared";

import { createProjectStepAiMessageAPI } from "../apis";
import { projectKeys } from "../constants";
import type { ProjectStepAiMessage } from "../types";

export const useCreateProjectStepAiMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectStepAiMessageAPI,
    onSuccess: (createdMessages, { projectId, stepCode }) => {
      queryClient.setQueryData<ProjectStepAiMessage[]>(
        projectKeys.stepAiMessages(projectId, stepCode),
        (previousMessages = []) => [...previousMessages, ...createdMessages],
      );
    },
    onError: (error) => {
      toaster.create({
        type: "error",
        description: getApiErrorMessage(error),
      });
    },
  });
};
