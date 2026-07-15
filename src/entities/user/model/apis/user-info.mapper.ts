import { isUserRole } from "../constants";
import type { UserRole } from "../types";

export interface UserInfoApiResponse {
  userId: string;
  nickname: string;
  profileUrl: string;
  role?: unknown;
}

export interface UserInfoResponse extends Omit<UserInfoApiResponse, "role"> {
  role: UserRole;
}

export const mapUserInfoResponse = (
  response: UserInfoApiResponse,
): UserInfoResponse => {
  if (!isUserRole(response.role)) {
    throw new Error("사용자 역할 정보를 확인할 수 없습니다.");
  }

  return {
    ...response,
    role: response.role,
  };
};
