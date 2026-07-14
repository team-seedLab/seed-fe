import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadAiMentorConversation } from "./useUploadAiMentorConversation";

const {
  mutateAsyncMock,
  refetchMock,
  useCreateProjectStepAiMessageMock,
  useGetProjectStepAiMessagesMock,
} = vi.hoisted(() => ({
  mutateAsyncMock: vi.fn(),
  refetchMock: vi.fn(),
  useCreateProjectStepAiMessageMock: vi.fn(),
  useGetProjectStepAiMessagesMock: vi.fn(),
}));

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useCreateProjectStepAiMessage: useCreateProjectStepAiMessageMock,
    useGetProjectStepAiMessages: useGetProjectStepAiMessagesMock,
  };
});

const createHook = (
  overrides: Partial<Parameters<typeof useUploadAiMentorConversation>[0]> = {},
) => {
  const ensurePromptSaved = vi.fn().mockResolvedValue(true);
  const hook = renderHook(() =>
    useUploadAiMentorConversation({
      editedPrompt: "수정된 프롬프트",
      ensurePromptSaved,
      isOpen: true,
      originalPrompt: "원본 프롬프트",
      projectId: "project-1",
      stepCode: "constraint_analysis",
      ...overrides,
    }),
  );

  return { ...hook, ensurePromptSaved };
};

describe("useUploadAiMentorConversation", () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
    mutateAsyncMock.mockResolvedValue([]);
    refetchMock.mockReset();
    useCreateProjectStepAiMessageMock.mockReset();
    useCreateProjectStepAiMessageMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
    });
    useGetProjectStepAiMessagesMock.mockReset();
    useGetProjectStepAiMessagesMock.mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
      refetch: refetchMock,
    });
  });

  it("패널이 열렸을 때만 현재 단계의 대화를 조회한다", () => {
    createHook({ isOpen: false });

    expect(useGetProjectStepAiMessagesMock).toHaveBeenCalledWith(
      "project-1",
      "constraint_analysis",
      false,
    );
  });

  it("입력한 질문을 CHAT 메시지로 전송하고 입력값을 비운다", async () => {
    const { result } = createHook();

    act(() => result.current.changeDraft("  부족한 점을 알려주세요.  "));
    await act(async () => result.current.sendQuestion());

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      messageType: "CHAT",
      content: "부족한 점을 알려주세요.",
    });
    expect(result.current.draft).toBe("");
  });

  it("질문 전송에 실패하면 입력값을 복원한다", async () => {
    mutateAsyncMock.mockRejectedValueOnce(new Error("전송 실패"));
    const { result } = createHook();

    act(() => result.current.changeDraft("복원할 질문"));
    await act(async () => result.current.sendQuestion());

    expect(result.current.draft).toBe("복원할 질문");
  });

  it("수정본 저장이 끝난 다음 재질문을 전송한다", async () => {
    let resolveSave!: (value: boolean) => void;
    const ensurePromptSaved = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveSave = resolve;
        }),
    );
    const { result } = createHook({ ensurePromptSaved });

    let reaskPromise!: Promise<void>;
    act(() => {
      reaskPromise = result.current.reaskWithEditedPrompt();
    });

    expect(ensurePromptSaved).toHaveBeenCalledWith("수정된 프롬프트");
    expect(mutateAsyncMock).not.toHaveBeenCalled();

    await act(async () => {
      resolveSave(true);
      await reaskPromise;
    });

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      messageType: "REASK_WITH_EDITED_PROMPT",
      content: "수정한 프롬프트를 기준으로 다시 검토해 주세요.",
    });
  });

  it("프롬프트가 원본과 같으면 재질문하지 않는다", async () => {
    const { ensurePromptSaved, result } = createHook({
      editedPrompt: "원본 프롬프트",
    });

    await act(async () => result.current.reaskWithEditedPrompt());

    expect(result.current.hasPromptChanges).toBe(false);
    expect(ensurePromptSaved).not.toHaveBeenCalled();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("다른 단계의 답변을 기다리는 동안 현재 단계 질문을 전송할 수 있다", async () => {
    const resolveRequests: Array<(value: unknown[]) => void> = [];
    mutateAsyncMock.mockImplementation(
      () =>
        new Promise<unknown[]>((resolve) => {
          resolveRequests.push(resolve);
        }),
    );
    const ensurePromptSaved = vi.fn().mockResolvedValue(true);
    const { rerender, result } = renderHook(
      ({ stepCode }: { stepCode: string }) =>
        useUploadAiMentorConversation({
          editedPrompt: "수정된 프롬프트",
          ensurePromptSaved,
          isOpen: true,
          originalPrompt: "원본 프롬프트",
          projectId: "project-1",
          stepCode,
        }),
      { initialProps: { stepCode: "constraint_analysis" } },
    );

    act(() => result.current.changeDraft("1단계 질문"));
    let firstRequest!: Promise<void>;
    act(() => {
      firstRequest = result.current.sendQuestion();
    });

    rerender({ stepCode: "outline" });
    act(() => result.current.changeDraft("2단계 질문"));
    let secondRequest!: Promise<void>;
    act(() => {
      secondRequest = result.current.sendQuestion();
    });

    expect(mutateAsyncMock).toHaveBeenCalledTimes(2);
    expect(mutateAsyncMock).toHaveBeenLastCalledWith({
      projectId: "project-1",
      stepCode: "outline",
      messageType: "CHAT",
      content: "2단계 질문",
    });

    await act(async () => {
      resolveRequests.forEach((resolve) => resolve([]));
      await Promise.all([firstRequest, secondRequest]);
    });
  });
});
