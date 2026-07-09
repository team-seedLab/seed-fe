import { HttpResponse, http } from "msw";

import type { UserInfoResponse } from "@/entities";
import type { ApiResponse, ErrorResponse } from "@/shared";

export const createApiSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  status: "SUCCESS",
  serverDateTime: new Date().toISOString(),
  data,
});

export const createApiErrorResponse = (
  overrides: Partial<ErrorResponse> = {},
): ErrorResponse => ({
  status: "ERROR",
  errorCode: "USER_INFO_ERROR",
  errorMessage: "사용자 정보를 불러오지 못했습니다.",
  serverDateTime: new Date().toISOString(),
  ...overrides,
});

export const DEFAULT_USER_INFO: UserInfoResponse = {
  userId: "user-1",
  nickname: "테스트 사용자",
  profileUrl: "",
  role: "MENTEE",
};

export const handlers = [
  http.get("*/api/user/me", () => {
    return HttpResponse.json(createApiSuccessResponse(DEFAULT_USER_INFO));
  }),
];
