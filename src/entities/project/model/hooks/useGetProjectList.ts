import { useQuery } from "@tanstack/react-query";

import { type ProjectListParameters, getProjectListAPI } from "../apis";
import { normalizeProjectListQueryParams, projectKeys } from "../constants";

export const useGetProjectList = (params: ProjectListParameters = {}) => {
  const queryParams = normalizeProjectListQueryParams(params);

  return useQuery({
    queryKey: projectKeys.list(queryParams),
    queryFn: () => getProjectListAPI(queryParams),
  });
};
