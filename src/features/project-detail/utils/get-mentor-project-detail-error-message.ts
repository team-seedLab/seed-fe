import { isAxiosError } from "axios";

import type { ErrorResponse } from "@/shared";

const MENTOR_PROJECT_FORBIDDEN_ERROR_CODE = "M001";

export const getMentorProjectDetailErrorMessage = (error: unknown) => {
  if (
    isAxiosError<ErrorResponse>(error) &&
    error.response?.data.errorCode === MENTOR_PROJECT_FORBIDDEN_ERROR_CODE
  ) {
    return "배정되지 않은 멘티의 프로젝트는 확인할 수 없습니다.";
  }

  return "프로젝트 정보를 불러오지 못했습니다.";
};
