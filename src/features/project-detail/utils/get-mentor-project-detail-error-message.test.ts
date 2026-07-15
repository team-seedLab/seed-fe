import { AxiosError, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";

import type { ErrorResponse } from "@/shared";

import { getMentorProjectDetailErrorMessage } from "./get-mentor-project-detail-error-message";

const createApiError = (errorCode: string) => {
  const response = {
    data: {
      status: "ERROR",
      errorCode,
      errorMessage: "접근할 수 없습니다.",
      serverDateTime: "2026-07-15 10:00:00",
    },
    status: 403,
    statusText: "Forbidden",
    headers: {},
    config: {},
  } as AxiosResponse<ErrorResponse>;

  return new AxiosError(
    "Forbidden",
    "ERR_BAD_REQUEST",
    undefined,
    undefined,
    response,
  );
};

describe("getMentorProjectDetailErrorMessage", () => {
  it("배정되지 않은 프로젝트 오류를 안내한다", () => {
    expect(getMentorProjectDetailErrorMessage(createApiError("M001"))).toBe(
      "배정되지 않은 멘티의 프로젝트는 확인할 수 없습니다.",
    );
  });

  it("그 외 오류는 일반 조회 실패로 안내한다", () => {
    expect(getMentorProjectDetailErrorMessage(createApiError("G002"))).toBe(
      "프로젝트 정보를 불러오지 못했습니다.",
    );
  });
});
