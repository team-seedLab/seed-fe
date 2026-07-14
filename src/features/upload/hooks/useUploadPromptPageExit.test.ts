import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useUploadPromptPageExit } from "./useUploadPromptPageExit";

const EDITOR_KEY = "project-1:step-1";

describe("useUploadPromptPageExit", () => {
  it("화면에서 이동하면 마지막 수정본을 일반 저장 큐에 전달한다", () => {
    const flushPrompt = vi.fn();
    const { unmount } = renderHook(() =>
      useUploadPromptPageExit({
        editorKey: EDITOR_KEY,
        cancelPendingSaves: vi.fn(),
        flushPrompt,
        getUnsavedPrompt: vi.fn().mockReturnValue("이동 전 수정본"),
      }),
    );

    unmount();

    expect(flushPrompt).toHaveBeenCalledWith(EDITOR_KEY);
  });

  it("페이지가 종료되면 기존 저장을 취소하고 최신 수정본을 저장한다", () => {
    const cancelPendingSaves = vi.fn();
    const onSaveBeforePageExit = vi.fn();
    const { unmount } = renderHook(() =>
      useUploadPromptPageExit({
        editorKey: EDITOR_KEY,
        cancelPendingSaves,
        flushPrompt: vi.fn(),
        getUnsavedPrompt: vi.fn().mockReturnValue("종료 전 최신 수정본"),
        onSaveBeforePageExit,
      }),
    );

    act(() => window.dispatchEvent(new Event("pagehide")));

    expect(cancelPendingSaves).toHaveBeenCalledWith(EDITOR_KEY);
    expect(onSaveBeforePageExit).toHaveBeenCalledWith("종료 전 최신 수정본");
    expect(cancelPendingSaves.mock.invocationCallOrder[0]).toBeLessThan(
      onSaveBeforePageExit.mock.invocationCallOrder[0],
    );

    unmount();
  });

  it("저장할 변경 사항이 없으면 페이지 종료 저장을 요청하지 않는다", () => {
    const cancelPendingSaves = vi.fn();
    const onSaveBeforePageExit = vi.fn();
    const { unmount } = renderHook(() =>
      useUploadPromptPageExit({
        editorKey: EDITOR_KEY,
        cancelPendingSaves,
        flushPrompt: vi.fn(),
        getUnsavedPrompt: vi.fn().mockReturnValue(null),
        onSaveBeforePageExit,
      }),
    );

    act(() => window.dispatchEvent(new Event("pagehide")));

    expect(cancelPendingSaves).not.toHaveBeenCalled();
    expect(onSaveBeforePageExit).not.toHaveBeenCalled();

    unmount();
  });
});
