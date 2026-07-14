import { useQuery } from "@tanstack/react-query";

import { getProjectStepSelfCheckAPI } from "../apis";
import { projectKeys } from "../constants";

export const useGetProjectStepSelfCheck = (
  projectId: string,
  stepCode: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: projectKeys.stepSelfCheck(projectId, stepCode),
    queryFn: () => getProjectStepSelfCheckAPI({ projectId, stepCode }),
    enabled: enabled && Boolean(projectId && stepCode),
    retry: false,
    throwOnError: false,
    meta: {
      showErrorToast: true,
      errorMessage: "Self-Check 내용을 불러오지 못했습니다.",
    },
  });
};
