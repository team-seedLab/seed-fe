import { useQuery } from "@tanstack/react-query";

import { type ProjectListParameters, getProjectListAPI } from "../apis";
import { normalizeProjectListQueryParams, projectKeys } from "../constants";

export const useGetProjectList = (params: ProjectListParameters = {}) => {
  const queryParams = normalizeProjectListQueryParams(params);

  return useQuery({
    queryKey: projectKeys.list(queryParams),
    queryFn: () => getProjectListAPI(queryParams),
    throwOnError: false,
    meta: {
      showErrorToast: true,
      errorMessage: "프로젝트 목록을 불러오지 못했습니다.",
    },
  });
};
