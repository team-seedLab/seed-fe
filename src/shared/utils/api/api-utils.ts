import { API_ERROR_MESSAGES } from "../../constants";
import { toaster } from "../../libs";
import type { ApiResponse, ErrorResponse } from "../../types";

// 커스텀 API 에러 클래스
export class ApiError extends Error {
  public readonly errorCode: string;
  public readonly serverDateTime: string;

  constructor(errorResponse: ErrorResponse) {
    super(errorResponse.errorMessage);
    this.name = "ApiError";
    this.errorCode = errorResponse.errorCode;
    this.serverDateTime = errorResponse.serverDateTime;
  }
}

// API 에러 메시지 표시 함수
export const showApiError = (apiError: ApiError) => {
  const customMessage =
    API_ERROR_MESSAGES[apiError.errorCode as keyof typeof API_ERROR_MESSAGES];
  const message = customMessage || apiError.message;
  toaster.create({
    type: "error",
    description: message,
  });
};

export function processApiResponse<T>(response: ApiResponse<T>): T {
  if (response.status === "SUCCESS") {
    return response.data;
  } else {
    // 에러 응답의 경우 커스텀 ApiError를 throw하여 더 상세한 에러 정보 제공
    const apiError = new ApiError(response);
    showApiError(apiError);
    throw apiError;
  }
}
