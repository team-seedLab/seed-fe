import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";

import { SERVER_PATH } from "@/shared";
import {
  createApiErrorResponse,
  createApiSuccessResponse,
} from "@/test/msw/handlers";
import { server } from "@/test/msw/server";

import {
  getProjectStepResultAPI,
  saveProjectStepResultAPI,
  saveProjectStepResultOnPageExitAPI,
} from "./project-step-result.api";

const RESULT_RESPONSE = {
  stepId: "step-1",
  stepCode: "constraint_analysis",
  stepName: "제약사항 분석",
  contentMarkdown: "작업 결과",
  createdAt: "2026-07-14T10:00:00",
  updatedAt: "2026-07-14T10:00:00",
};

const RESULT_URL = "*/api/projects/project-1/steps/constraint_analysis/result";

describe("project step result API", () => {
  it("조회한 작업 결과가 null이면 빈 문자열로 변환한다", async () => {
    server.use(
      http.get(RESULT_URL, () =>
        HttpResponse.json(
          createApiSuccessResponse({
            ...RESULT_RESPONSE,
            contentMarkdown: null,
          }),
        ),
      ),
    );

    const response = await getProjectStepResultAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
    });

    expect(response?.contentMarkdown).toBe("");
  });

  it("저장된 결과가 없으면 빈 상태를 반환한다", async () => {
    server.use(
      http.get(RESULT_URL, () =>
        HttpResponse.json(
          createApiErrorResponse({
            errorCode: "AP003",
            errorMessage: "해당 단계 결과를 등록하셔야 합니다",
          }),
          { status: 400 },
        ),
      ),
    );

    const response = await getProjectStepResultAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
    });

    expect(response).toBeNull();
  });

  it("작업 결과를 PUT 요청 본문으로 저장한다", async () => {
    let requestBody: unknown;
    server.use(
      http.put(RESULT_URL, async ({ request }) => {
        requestBody = await request.json();

        return HttpResponse.json(createApiSuccessResponse(RESULT_RESPONSE));
      }),
    );

    const response = await saveProjectStepResultAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      contentMarkdown: "작업 결과",
    });

    expect(requestBody).toEqual({ contentMarkdown: "작업 결과" });
    expect(response).toEqual(RESULT_RESPONSE);
  });

  it("페이지 종료 전 학습 결과를 keepalive 요청으로 저장한다", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    await saveProjectStepResultOnPageExitAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      contentMarkdown: "종료 전 학습 결과",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      new URL(RESULT_URL.replace("*", ""), SERVER_PATH),
      expect.objectContaining({
        body: JSON.stringify({ contentMarkdown: "종료 전 학습 결과" }),
        credentials: "include",
        keepalive: true,
        method: "PUT",
      }),
    );

    fetchMock.mockRestore();
  });

  it("keepalive 허용 크기를 넘는 학습 결과는 종료 요청을 보내지 않는다", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    await saveProjectStepResultOnPageExitAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      contentMarkdown: "가".repeat(64 * 1024),
    });

    expect(fetchMock).not.toHaveBeenCalled();

    fetchMock.mockRestore();
  });
});
