import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import {
  type MentorStudentListApiResponse,
  type MentorStudentListResponse,
  mapMentorStudentListResponse,
} from "./mentor-student-list.mapper";

export type {
  MentorDashboardMentee,
  MentorDashboardSummary,
  MentorStudentListResponse,
  MentorStudentReviewStatus,
} from "./mentor-student-list.mapper";

export const getMentorStudentListAPI =
  async (): Promise<MentorStudentListResponse> => {
    const response = await fetchInstance.get<
      ApiResponse<MentorStudentListApiResponse>
    >("/api/mentor/students");

    return mapMentorStudentListResponse(processApiResponse(response.data));
  };
