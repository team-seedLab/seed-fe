import { useQuery } from "@tanstack/react-query";

import { getProjectDetailAPI } from "../apis";
import { projectKeys } from "../constants";

export const useGetProjectDetail = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProjectDetailAPI(projectId),
    enabled: enabled && Boolean(projectId),
    throwOnError: false,
    meta: {
      showErrorToast: true,
      errorMessage: "프로젝트 정보를 불러오지 못했습니다.",
    },
  });
};
