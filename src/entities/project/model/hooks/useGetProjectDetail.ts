import { useQuery } from "@tanstack/react-query";

import { PROJECT_DETAIL_MOCK } from "../../mock";
import { projectKeys } from "../constants";

export const useGetProjectDetail = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => Promise.resolve(PROJECT_DETAIL_MOCK),
    enabled: Boolean(projectId),
    throwOnError: false,
    meta: {
      showErrorToast: true,
      errorMessage: "프로젝트 정보를 불러오지 못했습니다.",
    },
  });
};
