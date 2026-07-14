import { useQuery } from "@tanstack/react-query";

import { getProjectStepPromptAPI } from "../apis";
import { projectKeys } from "../constants";

export const useGetProjectStepPrompt = (
  projectId: string,
  stepCode: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: projectKeys.stepPrompt(projectId, stepCode),
    queryFn: () => getProjectStepPromptAPI({ projectId, stepCode }),
    enabled: enabled && Boolean(projectId && stepCode),
    retry: false,
    throwOnError: false,
  });
};
