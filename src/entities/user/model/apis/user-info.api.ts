import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type { UserRole } from "../types";

export interface UserInfoResponse {
  userId: string;
  nickname: string;
  profileUrl: string;
  role?: UserRole;
}

export const getUserInfoAPI = async (): Promise<UserInfoResponse> => {
  const response =
    await fetchInstance.get<ApiResponse<UserInfoResponse>>("/api/user/me");
  return processApiResponse(response.data);
};
