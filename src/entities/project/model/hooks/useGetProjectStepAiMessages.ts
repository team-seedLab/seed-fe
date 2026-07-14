import { useQuery } from "@tanstack/react-query";

import { getProjectStepAiMessagesAPI } from "../apis";
import { projectKeys } from "../constants";

export const useGetProjectStepAiMessages = (
  projectId: string,
  stepCode: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: projectKeys.stepAiMessages(projectId, stepCode),
    queryFn: () => getProjectStepAiMessagesAPI({ projectId, stepCode }),
    enabled: enabled && Boolean(projectId && stepCode),
    retry: false,
    throwOnError: false,
    meta: {
      showErrorToast: true,
      errorMessage: "AI 멘토 대화를 불러오지 못했습니다.",
    },
  });
};
