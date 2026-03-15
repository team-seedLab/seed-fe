import { API_ERROR_MESSAGES } from "../../constants";
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

// UI에 독립적으로 재사용할 수 있는 에러 메시지 변환 함수
export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    const customMessage =
      API_ERROR_MESSAGES[error.errorCode as keyof typeof API_ERROR_MESSAGES];
    return customMessage || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "요청을 처리할 수 없습니다.";
};

export function processApiResponse<T>(response: ApiResponse<T>): T {
  if (response.status === "SUCCESS") {
    return response.data;
  } else {
    // 에러 응답의 경우 커스텀 ApiError를 throw하여 더 상세한 에러 정보 제공
    const apiError = new ApiError(response);
    throw apiError;
  }
}
