import { useQuery } from "@tanstack/react-query";

import { PROJECT_DETAIL_MOCK } from "../../mock";
import { projectKeys } from "../constants";

export const useGetProjectDetail = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => Promise.resolve(PROJECT_DETAIL_MOCK),
    enabled: Boolean(projectId),
  });
};
