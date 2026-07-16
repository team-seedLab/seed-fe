import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import {
  type UserInfoApiResponse,
  type UserInfoResponse,
  mapUserInfoResponse,
} from "./user-info.mapper";

export type { UserInfoResponse } from "./user-info.mapper";

export const getUserInfoAPI = async (): Promise<UserInfoResponse> => {
  const response =
    await fetchInstance.get<ApiResponse<UserInfoApiResponse>>("/api/user/me");
  return mapUserInfoResponse(processApiResponse(response.data));
};
