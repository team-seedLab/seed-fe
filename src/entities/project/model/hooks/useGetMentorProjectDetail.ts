import { useQuery } from "@tanstack/react-query";

import { getMentorProjectDetailAPI } from "../apis";
import { projectKeys } from "../constants";

export const useGetMentorProjectDetail = (
  projectId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: projectKeys.mentorDetail(projectId),
    queryFn: () => getMentorProjectDetailAPI(projectId),
    enabled: enabled && Boolean(projectId),
    throwOnError: false,
    meta: {
      showErrorToast: false,
    },
  });
};
