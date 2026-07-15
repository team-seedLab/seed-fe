import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import {
  type MentorStudentProjectListApiResponse,
  type MentorStudentProjectListResponse,
  mapMentorStudentProjectListResponse,
} from "./mentor-student-project-list.mapper";

export type {
  MentorStudentProjectListProject,
  MentorStudentProjectListResponse,
} from "./mentor-student-project-list.mapper";

export const getMentorStudentProjectListAPI = async (
  menteeId: string,
): Promise<MentorStudentProjectListResponse> => {
  const response = await fetchInstance.get<
    ApiResponse<MentorStudentProjectListApiResponse>
  >(`/api/mentor/students/${menteeId}/projects`);

  return mapMentorStudentProjectListResponse(processApiResponse(response.data));
};
