import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useUploadPromptEditor } from "./useUploadPromptEditor";

describe("useUploadPromptEditor", () => {
  it("저장된 수정본이 없으면 원본 프롬프트로 시작한다", () => {
    const { result } = renderHook(() =>
      useUploadPromptEditor({
        editorKey: "project-1:step-1",
        originalPrompt: "원본 프롬프트",
      }),
    );

    expect(result.current.editedPrompt).toBe("원본 프롬프트");
  });

  it("저장된 수정본이 있으면 수정본으로 시작한다", () => {
    const { result } = renderHook(() =>
      useUploadPromptEditor({
        editorKey: "project-1:step-1",
        initialEditedPrompt: "저장된 수정본",
        originalPrompt: "원본 프롬프트",
      }),
    );

    expect(result.current.editedPrompt).toBe("저장된 수정본");
  });

  it("변경된 수정본만 저장 요청한다", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useUploadPromptEditor({
        editorKey: "project-1:step-1",
        originalPrompt: "원본 프롬프트",
        onSave,
      }),
    );

    act(() => result.current.changePrompt("변경된 프롬프트"));
    await act(async () => result.current.commitPrompt("변경된 프롬프트"));
    await act(async () => result.current.commitPrompt("변경된 프롬프트"));

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledWith("변경된 프롬프트");
  });

  it("초기화하면 원본으로 돌아가고 수정본 제거를 요청한다", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useUploadPromptEditor({
        editorKey: "project-1:step-1",
        initialEditedPrompt: "저장된 수정본",
        originalPrompt: "원본 프롬프트",
        onSave,
      }),
    );

    await act(async () => result.current.resetPrompt());

    expect(result.current.editedPrompt).toBe("원본 프롬프트");
    expect(onSave).toHaveBeenCalledWith(null);
  });

  it("저장에 실패해도 작성 중인 수정본을 유지한다", async () => {
    const onSave = vi.fn().mockRejectedValue(new Error("저장 실패"));
    const { result } = renderHook(() =>
      useUploadPromptEditor({
        editorKey: "project-1:step-1",
        originalPrompt: "원본 프롬프트",
        onSave,
      }),
    );

    act(() => result.current.changePrompt("저장되지 않은 수정본"));
    let isSaved = true;
    await act(async () => {
      isSaved = await result.current.commitPrompt("저장되지 않은 수정본");
    });

    expect(isSaved).toBe(false);
    expect(result.current.editedPrompt).toBe("저장되지 않은 수정본");
  });

  it("다른 단계로 전환하면 해당 단계의 프롬프트를 사용한다", () => {
    const { result, rerender } = renderHook(
      ({ editorKey, originalPrompt }) =>
        useUploadPromptEditor({ editorKey, originalPrompt }),
      {
        initialProps: {
          editorKey: "project-1:step-1",
          originalPrompt: "첫 번째 단계 원본",
        },
      },
    );

    act(() => result.current.changePrompt("첫 번째 단계 수정본"));
    rerender({
      editorKey: "project-1:step-2",
      originalPrompt: "두 번째 단계 원본",
    });

    expect(result.current.editedPrompt).toBe("두 번째 단계 원본");
  });
});
