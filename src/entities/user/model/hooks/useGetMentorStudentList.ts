import { useQuery } from "@tanstack/react-query";

import { getMentorStudentListAPI } from "../apis";

export const MENTOR_STUDENT_LIST_QUERY_KEY = ["mentor", "students"] as const;

export const useGetMentorStudentList = () => {
  return useQuery({
    queryKey: MENTOR_STUDENT_LIST_QUERY_KEY,
    queryFn: getMentorStudentListAPI,
    refetchOnMount: "always",
    throwOnError: false,
    meta: {
      showErrorToast: false,
    },
  });
};
