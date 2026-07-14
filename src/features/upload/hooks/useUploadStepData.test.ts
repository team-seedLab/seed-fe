import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadStepData } from "./useUploadStepData";

const { promptQueryMock, resultQueryMock, updatePromptMutateAsyncMock } =
  vi.hoisted(() => ({
    promptQueryMock: vi.fn(),
    resultQueryMock: vi.fn(),
    updatePromptMutateAsyncMock: vi.fn(),
  }));

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useGetOrCreateProjectStepPrompt: () => promptQueryMock(),
    useGetProjectStepResult: () => resultQueryMock(),
    useUpdateProjectStepPrompt: () => ({
      mutateAsync: updatePromptMutateAsyncMock,
    }),
  };
});

describe("useUploadStepData", () => {
  beforeEach(() => {
    promptQueryMock.mockReset();
    resultQueryMock.mockReset();
    updatePromptMutateAsyncMock.mockReset();

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
});
