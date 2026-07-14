import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import {
  createApiErrorResponse,
  createApiSuccessResponse,
} from "@/test/msw/handlers";
import { server } from "@/test/msw/server";

import {
  getProjectStepResultAPI,
  saveProjectStepResultAPI,
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
});
