import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadStepData } from "./useUploadStepData";

const {
  promptQueryMock,
  resultQueryMock,
  saveResultMutateAsyncMock,
  saveResultOnPageExitMock,
  updatePromptMutateAsyncMock,
  updatePromptOnPageExitMock,
} = vi.hoisted(() => ({
  promptQueryMock: vi.fn(),
  resultQueryMock: vi.fn(),
  saveResultMutateAsyncMock: vi.fn(),
  saveResultOnPageExitMock: vi.fn(),
  updatePromptMutateAsyncMock: vi.fn(),
  updatePromptOnPageExitMock: vi.fn(),
}));

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useGetOrCreateProjectStepPrompt: () => promptQueryMock(),
    useGetProjectStepResult: () => resultQueryMock(),
    useSaveProjectStepResult: () => ({
      mutateAsync: saveResultMutateAsyncMock,
    }),
    useUpdateProjectStepPrompt: () => ({
      mutateAsync: updatePromptMutateAsyncMock,
    }),
    saveProjectStepResultOnPageExitAPI: saveResultOnPageExitMock,
    updateProjectStepPromptOnPageExitAPI: updatePromptOnPageExitMock,
  };
});

describe("useUploadStepData", () => {
  beforeEach(() => {
    promptQueryMock.mockReset();
    resultQueryMock.mockReset();
    saveResultMutateAsyncMock.mockReset();
    saveResultOnPageExitMock.mockReset();
    updatePromptMutateAsyncMock.mockReset();
    updatePromptOnPageExitMock.mockReset();

    promptQueryMock.mockReturnValue({
      data: {
        stepCode: "constraint_analysis",
        finalPrompt: "저장된 프롬프트",
      },
      isLoading: false,
    });
    resultQueryMock.mockReturnValue({
      data: {
        stepCode: "constraint_analysis",
        contentMarkdown: "저장된 결과",
      },
      isLoading: false,
    });
    saveResultMutateAsyncMock.mockResolvedValue(undefined);
    updatePromptMutateAsyncMock.mockResolvedValue(undefined);
  });

  it("프롬프트와 결과 조회 데이터를 업로드 단계에 제공한다", () => {
    const { result } = renderHook(() =>
      useUploadStepData({
        projectId: "project-1",
        stepCode: "constraint_analysis",
      }),
    );

    expect(result.current.promptData?.finalPrompt).toBe("저장된 프롬프트");
    expect(result.current.resultData?.contentMarkdown).toBe("저장된 결과");
    expect(result.current.isStepLoading).toBe(false);
  });

  it("수정 프롬프트를 현재 프로젝트와 단계에 저장한다", async () => {
    const { result } = renderHook(() =>
      useUploadStepData({
        projectId: "project-1",
        stepCode: "constraint_analysis",
      }),
    );

    await act(async () => {
      await result.current.savePrompt("수정된 프롬프트");
    });

    expect(updatePromptMutateAsyncMock).toHaveBeenCalledWith({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      editedPrompt: "수정된 프롬프트",
    });
  });

  it("진행 중인 프롬프트 저장을 취소할 수 있도록 신호를 전달한다", async () => {
    const controller = new AbortController();
    const { result } = renderHook(() =>
      useUploadStepData({
        projectId: "project-1",
        stepCode: "constraint_analysis",
      }),
    );

    await act(async () => {
      await result.current.savePrompt("수정된 프롬프트", controller.signal);
    });

    expect(updatePromptMutateAsyncMock).toHaveBeenCalledWith({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      editedPrompt: "수정된 프롬프트",
      signal: controller.signal,
    });
  });

  it("페이지 종료 시 수정 프롬프트를 keepalive 저장 함수에 전달한다", () => {
    const { result } = renderHook(() =>
      useUploadStepData({
        projectId: "project-1",
        stepCode: "constraint_analysis",
      }),
    );

    act(() => {
      result.current.savePromptOnPageExit("종료 전 수정 프롬프트");
    });

    expect(updatePromptOnPageExitMock).toHaveBeenCalledWith({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      editedPrompt: "종료 전 수정 프롬프트",
    });
  });

  it("학습 결과를 현재 프로젝트와 단계에 저장한다", async () => {
    const controller = new AbortController();
    const { result } = renderHook(() =>
      useUploadStepData({
        projectId: "project-1",
        stepCode: "constraint_analysis",
      }),
    );

    await act(async () => {
      await result.current.saveResult("작성 중인 학습 결과", controller.signal);
    });

    expect(saveResultMutateAsyncMock).toHaveBeenCalledWith({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      contentMarkdown: "작성 중인 학습 결과",
      signal: controller.signal,
    });
  });

  it("페이지 종료 전 학습 결과를 keepalive 저장 함수에 전달한다", () => {
    const { result } = renderHook(() =>
      useUploadStepData({
        projectId: "project-1",
        stepCode: "constraint_analysis",
      }),
    );

    act(() => {
      result.current.saveResultOnPageExit("종료 전 학습 결과");
    });

    expect(saveResultOnPageExitMock).toHaveBeenCalledWith({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      contentMarkdown: "종료 전 학습 결과",
    });
  });
});
