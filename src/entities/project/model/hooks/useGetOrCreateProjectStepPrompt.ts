import { useQuery } from "@tanstack/react-query";

import { createProjectStepPromptAPI } from "../apis";
import { projectKeys } from "../constants";

export const useGetOrCreateProjectStepPrompt = (
  projectId: string,
  stepCode: string,
) => {
  return useQuery({
    queryKey: projectKeys.stepPrompt(projectId, stepCode),
    queryFn: () => createProjectStepPromptAPI({ projectId, stepCode }),
    enabled: Boolean(projectId && stepCode),
    retry: false,
    throwOnError: false,
    meta: {
      showErrorToast: true,
      errorMessage: "단계 프롬프트를 불러오지 못했습니다.",
    },
  });
};
