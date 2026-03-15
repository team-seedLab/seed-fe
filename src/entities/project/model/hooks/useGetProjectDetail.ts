import { useQuery } from "@tanstack/react-query";

import { getProjectDetailAPI } from "../apis";
import { projectKeys } from "../constants";

export const useGetProjectDetail = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProjectDetailAPI(projectId),
    enabled: Boolean(projectId),
  });
};
