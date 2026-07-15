import { useQuery } from "@tanstack/react-query";

import { getMentorStudentProjectListAPI } from "../apis";
import { projectKeys } from "../constants";

export const useGetMentorStudentProjectList = (menteeId: string) => {
  return useQuery({
    queryKey: projectKeys.mentorStudentProjectList(menteeId),
    queryFn: () => getMentorStudentProjectListAPI(menteeId),
    enabled: Boolean(menteeId),
    refetchOnMount: "always",
    throwOnError: false,
    meta: {
      showErrorToast: false,
    },
  });
};
