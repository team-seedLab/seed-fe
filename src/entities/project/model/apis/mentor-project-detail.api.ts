import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import {
  type MentorProjectDetailApiResponse,
  type MentorProjectDetailResponse,
  type MentorProjectReviewStatus,
  mapMentorProjectDetailResponse,
} from "./mentor-project-detail.mapper";

export type {
  MentorProjectDetailResponse,
  MentorProjectReviewStatus,
  MentorProjectStepDetail,
} from "./mentor-project-detail.mapper";

export type MentorProjectReviewResponse = {
  projectReviewId: string;
  projectId: string;
  status: MentorProjectReviewStatus;
  reviewedAt: string;
  createdAt: string;
  updatedAt: string;
};

export const getMentorProjectDetailAPI = async (
  projectId: string,
): Promise<MentorProjectDetailResponse> => {
  const response = await fetchInstance.get<
    ApiResponse<MentorProjectDetailApiResponse>
  >(`/api/mentor/projects/${projectId}`);

  return mapMentorProjectDetailResponse(processApiResponse(response.data));
};

export const completeMentorProjectReviewAPI = async (
  projectId: string,
): Promise<MentorProjectReviewResponse> => {
  const response = await fetchInstance.patch<
    ApiResponse<MentorProjectReviewResponse>
  >(`/api/mentor/projects/${projectId}/review`);

  return processApiResponse(response.data);
};
