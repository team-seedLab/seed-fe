import { act, renderHook, waitFor } from "@testing-library/react";
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

  it("초기화하면 원본으로 돌아가고 원본 저장을 요청한다", async () => {
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
    expect(onSave).toHaveBeenCalledWith("원본 프롬프트");
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

  it("여러 수정본의 저장 요청을 입력 순서대로 처리한다", async () => {
    let resolveFirstSave!: () => void;
    const onSave = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            resolveFirstSave = resolve;
          }),
      )
      .mockResolvedValueOnce(undefined);
    const { result } = renderHook(() =>
      useUploadPromptEditor({
        editorKey: "project-1:step-1",
        originalPrompt: "원본 프롬프트",
        onSave,
      }),
    );
    let firstCommit!: Promise<boolean>;
    let secondCommit!: Promise<boolean>;

    act(() => {
      firstCommit = result.current.commitPrompt("첫 번째 수정본");
      secondCommit = result.current.commitPrompt("두 번째 수정본");
    });

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave).toHaveBeenNthCalledWith(1, "첫 번째 수정본");

    await act(async () => {
      resolveFirstSave();
      await Promise.all([firstCommit, secondCommit]);
    });

    expect(onSave).toHaveBeenCalledTimes(2);
    expect(onSave).toHaveBeenNthCalledWith(2, "두 번째 수정본");
  });

  it("화면에서 나갈 때 마지막 수정본을 일반 저장 요청으로 전달한다", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result, unmount } = renderHook(() =>
      useUploadPromptEditor({
        editorKey: "project-1:step-1",
        originalPrompt: "원본 프롬프트",
        onSave,
      }),
    );

    act(() => result.current.changePrompt("이동 전 수정본"));
    unmount();

    await waitFor(() => expect(onSave).toHaveBeenCalledWith("이동 전 수정본"));
  });

  it("페이지가 종료될 때 마지막 수정본을 keepalive 저장 요청으로 전달한다", () => {
    const onSaveBeforePageExit = vi.fn();
    const { result, unmount } = renderHook(() =>
      useUploadPromptEditor({
        editorKey: "project-1:step-1",
        originalPrompt: "원본 프롬프트",
        onSaveBeforePageExit,
      }),
    );

    act(() => result.current.changePrompt("종료 전 수정본"));
    act(() => window.dispatchEvent(new Event("pagehide")));

    expect(onSaveBeforePageExit).toHaveBeenCalledWith("종료 전 수정본");

    unmount();
  });
});
