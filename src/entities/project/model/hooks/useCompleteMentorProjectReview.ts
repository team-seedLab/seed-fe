import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage, toaster } from "@/shared";

import {
  type MentorProjectDetailResponse,
  completeMentorProjectReviewAPI,
} from "../apis";
import { projectKeys } from "../constants";

export const useCompleteMentorProjectReview = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completeMentorProjectReviewAPI(projectId),
    onSuccess: (review) => {
      queryClient.setQueryData<MentorProjectDetailResponse>(
        projectKeys.mentorDetail(projectId),
        (project) => {
          if (!project) {
            return project;
          }

          return {
            ...project,
            reviewStatus: review.status,
            reviewedAt: review.reviewedAt,
          };
        },
      );
      toaster.create({
        type: "success",
        description: "프로젝트 검토를 완료했습니다.",
      });
    },
    onError: (error) => {
      toaster.create({
        type: "error",
        description: getApiErrorMessage(error),
      });
    },
  });
};
