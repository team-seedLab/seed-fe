import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";

import {
  getProjectStepSelfCheckAPI,
  saveProjectStepSelfCheckAPI,
} from "./project-step-self-check.api";

const SELF_CHECK_RESPONSE = {
  selfCheckId: null,
  stepId: "step-1",
  stepCode: "constraint_analysis",
  stepName: "제약사항 분석",
  checkItems: [
    {
      key: "core_understanding",
      question: "이번 단계에서 이해한 핵심 내용을 자신의 말로 설명해 주세요.",
      answer: null,
    },
    {
      key: "result_application",
      question: "이해한 내용을 결과물에 어떻게 적용했나요?",
      answer: null,
    },
    {
      key: "uncertainty_review",
      question: "다시 확인해야 할 부분은 무엇인가요?",
      answer: null,
    },
  ],
  submittedAt: null,
  createdAt: null,
  updatedAt: null,
};

const SELF_CHECK_URL =
  "*/api/projects/project-1/steps/constraint_analysis/self-check";

describe("project step self-check API", () => {
  it("단계의 Self-Check 질문과 기존 답변을 조회한다", async () => {
    server.use(
      http.get(SELF_CHECK_URL, () =>
        HttpResponse.json(createApiSuccessResponse(SELF_CHECK_RESPONSE)),
      ),
    );

    const response = await getProjectStepSelfCheckAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
    });

    expect(response).toEqual(SELF_CHECK_RESPONSE);
  });

  it("질문 key와 답변을 PUT 요청 본문으로 저장한다", async () => {
    const checkItems = SELF_CHECK_RESPONSE.checkItems.map(({ key }) => ({
      key,
      answer: "공백을 제외하고 열 글자 이상 작성한 답변입니다.",
    }));
    let requestBody: unknown;
    server.use(
      http.put(SELF_CHECK_URL, async ({ request }) => {
        requestBody = await request.json();

        return HttpResponse.json(
          createApiSuccessResponse({
            ...SELF_CHECK_RESPONSE,
            selfCheckId: "self-check-1",
            checkItems: SELF_CHECK_RESPONSE.checkItems.map((item) => ({
              ...item,
              answer: checkItems.find(({ key }) => key === item.key)?.answer,
            })),
          }),
        );
      }),
    );

    await saveProjectStepSelfCheckAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      checkItems,
    });

    expect(requestBody).toEqual({ checkItems });
  });
});
