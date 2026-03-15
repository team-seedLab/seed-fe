import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

export interface UserInfoResponse {
  userId: string;
  nickname: string;
  profileUrl: string;
}

export const getUserInfoAPI = async (): Promise<UserInfoResponse> => {
  const response =
    await fetchInstance.get<ApiResponse<UserInfoResponse>>("/api/user/me");
  return processApiResponse(response.data);
};
