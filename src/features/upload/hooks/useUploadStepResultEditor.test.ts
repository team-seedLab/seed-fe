import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  readUploadStepResultDraft,
  writeUploadStepResultDraft,
} from "../utils";

import { useUploadStepResultEditor } from "./useUploadStepResultEditor";

const EDITOR_KEY = "project-1:constraint_analysis";

describe("useUploadStepResultEditor", () => {
  it("변경된 학습 결과만 저장 큐에 전달한다", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useUploadStepResultEditor({
        editorKey: EDITOR_KEY,
        initialResult: "저장된 학습 결과",
        onSave,
      }),
    );

    act(() => result.current.changeResult("수정한 학습 결과"));
    await act(async () => {
      await result.current.commitResult("수정한 학습 결과");
    });

    expect(result.current.resultText).toBe("수정한 학습 결과");
    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledWith(
      "수정한 학습 결과",
      expect.any(AbortSignal),
    );
  });

  it("화면에서 나가면 작성 중인 학습 결과를 저장한다", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result, unmount } = renderHook(() =>
      useUploadStepResultEditor({
        editorKey: EDITOR_KEY,
        initialResult: "",
        onSave,
      }),
    );

    act(() => result.current.changeResult("이동 전 학습 결과"));
    unmount();

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        "이동 전 학습 결과",
        expect.any(AbortSignal),
      ),
    );
    await waitFor(() =>
      expect(readUploadStepResultDraft(EDITOR_KEY)).toBeNull(),
    );
  });

  it("페이지 종료 시 최신 학습 결과를 keepalive 저장 함수에 전달한다", () => {
    const onSaveBeforePageExit = vi.fn();
    const { result, unmount } = renderHook(() =>
      useUploadStepResultEditor({
        editorKey: EDITOR_KEY,
        initialResult: "",
        onSaveBeforePageExit,
      }),
    );

    act(() => result.current.changeResult("종료 전 학습 결과"));
    act(() => window.dispatchEvent(new Event("pagehide")));

    expect(onSaveBeforePageExit).toHaveBeenCalledWith("종료 전 학습 결과");
    expect(readUploadStepResultDraft(EDITOR_KEY)).toBe("종료 전 학습 결과");

    unmount();
  });

  it("페이지 종료 전에 남긴 초안을 다음 진입에서 복구하고 저장한다", async () => {
    writeUploadStepResultDraft(EDITOR_KEY, "복구할 학습 결과");
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useUploadStepResultEditor({
        editorKey: EDITOR_KEY,
        initialResult: "서버에 저장된 학습 결과",
        onSave,
      }),
    );

    expect(result.current.resultText).toBe("복구할 학습 결과");
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        "복구할 학습 결과",
        expect.any(AbortSignal),
      ),
    );
    await waitFor(() =>
      expect(readUploadStepResultDraft(EDITOR_KEY)).toBeNull(),
    );
    expect(result.current.resultText).toBe("복구할 학습 결과");
  });

  it("단계 데이터가 준비된 뒤에만 종료 초안을 서버에 복구한다", async () => {
    writeUploadStepResultDraft(EDITOR_KEY, "복구할 학습 결과");
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { rerender } = renderHook(
      ({ isReady }) =>
        useUploadStepResultEditor({
          editorKey: EDITOR_KEY,
          initialResult: "서버에 저장된 학습 결과",
          isReady,
          onSave,
        }),
      { initialProps: { isReady: false } },
    );

    expect(onSave).not.toHaveBeenCalled();

    rerender({ isReady: true });

    await waitFor(() => expect(onSave).toHaveBeenCalledOnce());
  });

  it("페이지 종료로 취소한 이전 저장이 늦게 끝나도 복구 초안을 유지한다", async () => {
    let resolveSave!: () => void;
    const onSave = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
    );
    const { result, unmount } = renderHook(() =>
      useUploadStepResultEditor({
        editorKey: EDITOR_KEY,
        initialResult: "",
        onSave,
      }),
    );
    let activeCommit!: Promise<boolean>;

    act(() => result.current.changeResult("종료 직전 학습 결과"));
    act(() => {
      activeCommit = result.current.commitResult("종료 직전 학습 결과");
    });
    await waitFor(() => expect(onSave).toHaveBeenCalledOnce());

    act(() => window.dispatchEvent(new Event("pagehide")));

    await act(async () => {
      resolveSave();
      await activeCommit;
    });

    expect(await activeCommit).toBe(false);
    expect(readUploadStepResultDraft(EDITOR_KEY)).toBe("종료 직전 학습 결과");

    unmount();
  });
});
