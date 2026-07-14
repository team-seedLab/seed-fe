import { HttpResponse, http } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchInstance } from "@/shared";
import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";

import {
  createProjectStepAiMessageAPI,
  getProjectStepAiMessagesAPI,
} from "./project-step-ai-message.api";

const AI_MESSAGE_URL =
  "*/api/projects/project-1/steps/constraint_analysis/ai-messages";

const AI_MESSAGES = [
  {
    aiMessageId: "message-1",
    turnId: "turn-1",
    sender: "USER" as const,
    messageType: "CHAT" as const,
    content: "이 프롬프트에서 부족한 점을 알려주세요.",
    inputTokens: null,
    outputTokens: null,
    totalTokens: null,
    createdAt: "2026-07-15T10:00:00",
  },
  {
    aiMessageId: "message-2",
    turnId: "turn-1",
    sender: "ASSISTANT" as const,
    messageType: "CHAT" as const,
    content: "핵심 조건을 조금 더 구체적으로 작성해 보세요.",
    inputTokens: 100,
    outputTokens: 50,
    totalTokens: 150,
    createdAt: "2026-07-15T10:00:01",
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe("project step AI message API", () => {
  it("현재 단계의 AI 멘토 대화 내역을 조회한다", async () => {
    server.use(
      http.get(AI_MESSAGE_URL, () =>
        HttpResponse.json(createApiSuccessResponse(AI_MESSAGES)),
      ),
    );

    const response = await getProjectStepAiMessagesAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
    });

    expect(response).toEqual(AI_MESSAGES);
  });

  it("질문 유형과 내용을 POST 요청 본문으로 전송한다", async () => {
    const postSpy = vi.spyOn(fetchInstance, "post");
    let requestBody: unknown;
    server.use(
      http.post(AI_MESSAGE_URL, async ({ request }) => {
        requestBody = await request.json();

        return HttpResponse.json(createApiSuccessResponse(AI_MESSAGES));
      }),
    );

    const response = await createProjectStepAiMessageAPI({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      messageType: "REASK_WITH_EDITED_PROMPT",
      content: "수정한 프롬프트를 기준으로 다시 검토해 주세요.",
    });

    expect(requestBody).toEqual({
      messageType: "REASK_WITH_EDITED_PROMPT",
      content: "수정한 프롬프트를 기준으로 다시 검토해 주세요.",
    });
    expect(postSpy).toHaveBeenCalledWith(
      "/api/projects/project-1/steps/constraint_analysis/ai-messages",
      {
        messageType: "REASK_WITH_EDITED_PROMPT",
        content: "수정한 프롬프트를 기준으로 다시 검토해 주세요.",
      },
      { timeout: 40_000 },
    );
    expect(response).toEqual(AI_MESSAGES);
  });
});
