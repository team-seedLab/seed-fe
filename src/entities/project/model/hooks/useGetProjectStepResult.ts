import { useQuery } from "@tanstack/react-query";

import { getProjectStepResultAPI } from "../apis";
import { projectKeys } from "../constants";

export const useGetProjectStepResult = (
  projectId: string,
  stepCode: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: projectKeys.stepResult(projectId, stepCode),
    queryFn: () => getProjectStepResultAPI({ projectId, stepCode }),
    enabled: enabled && Boolean(projectId && stepCode),
    retry: false,
    throwOnError: false,
    meta: {
      showErrorToast: true,
      errorMessage: "단계 작업 결과를 불러오지 못했습니다.",
    },
  });
};
