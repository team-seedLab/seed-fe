import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";

import {
  createProjectStepPromptAPI,
  getProjectStepPromptAPI,
  updateProjectStepPromptAPI,
} from "./project-step-prompt.api";

const PROMPT_RESPONSE = {
  stepId: "step-1",
  stepCode: "constraint_analysis",
  stepName: "제약사항 분석",
  providedPromptSnapshot: "원본 프롬프트",
  editedPrompt: null,
  finalPrompt: "원본 프롬프트",
  formatPrompt: "결과 추출 프롬프트",
  addedCount: 0,
  removedCount: 0,
  diffJson: {},
  createdAt: "2026-07-14T10:00:00",
  updatedAt: "2026-07-14T10:00:00",
};

const PROMPT_URL = "*/api/projects/project-1/steps/constraint_analysis/prompt";

describe("project step prompt API", () => {
  it("단계 프롬프트를 생성하거나 기존 프롬프트를 재조회한다", async () => {
    server.use(
      http.post(PROMPT_URL, () =>
        HttpResponse.json(createApiSuccessResponse(PROMPT_RESPONSE)),
      ),
    );

    const response = await createProjectStepPromptAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
    });

    expect(response).toEqual(PROMPT_RESPONSE);
  });

  it("프로젝트 상세에서 단계 프롬프트를 조회한다", async () => {
    server.use(
      http.get(PROMPT_URL, () =>
        HttpResponse.json(createApiSuccessResponse(PROMPT_RESPONSE)),
      ),
    );

    const response = await getProjectStepPromptAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
    });

    expect(response).toEqual(PROMPT_RESPONSE);
  });

  it("수정 프롬프트를 PUT 요청 본문으로 저장한다", async () => {
    let requestBody: unknown;
    server.use(
      http.put(PROMPT_URL, async ({ request }) => {
        requestBody = await request.json();

        return HttpResponse.json(
          createApiSuccessResponse({
            ...PROMPT_RESPONSE,
            editedPrompt: "수정된 프롬프트",
            finalPrompt: "수정된 프롬프트",
          }),
        );
      }),
    );

    const response = await updateProjectStepPromptAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      editedPrompt: "수정된 프롬프트",
    });

    expect(requestBody).toEqual({ editedPrompt: "수정된 프롬프트" });
    expect(response.finalPrompt).toBe("수정된 프롬프트");
  });
});
