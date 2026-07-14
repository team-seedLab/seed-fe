import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useUploadPromptSaveQueue } from "./useUploadPromptSaveQueue";

const EDITOR_KEY = "project-1:step-1";

describe("useUploadPromptSaveQueue", () => {
  it("변경된 수정본만 저장 요청한다", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useUploadPromptSaveQueue({
        editorKey: EDITOR_KEY,
        initialPrompt: "원본 프롬프트",
        onSave,
      }),
    );

    await act(async () => result.current.commitPrompt("변경된 프롬프트"));
    await act(async () => result.current.commitPrompt("변경된 프롬프트"));

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledWith(
      "변경된 프롬프트",
      expect.any(AbortSignal),
    );
  });

  it("저장 실패를 호출자에게 반환한다", async () => {
    const onSave = vi.fn().mockRejectedValue(new Error("저장 실패"));
    const { result } = renderHook(() =>
      useUploadPromptSaveQueue({
        editorKey: EDITOR_KEY,
        initialPrompt: "원본 프롬프트",
        onSave,
      }),
    );
    let isSaved = true;

    await act(async () => {
      isSaved = await result.current.commitPrompt("저장되지 않은 수정본");
    });

    expect(isSaved).toBe(false);
  });

  it("화면 이탈 시 현재 수정본을 저장 큐에 추가한다", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useUploadPromptSaveQueue({
        editorKey: EDITOR_KEY,
        initialPrompt: "원본 프롬프트",
        onSave,
      }),
    );

    act(() => {
      result.current.setCurrentPrompt("이동 전 수정본");
      result.current.flushPrompt(EDITOR_KEY);
    });

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        "이동 전 수정본",
        expect.any(AbortSignal),
      ),
    );
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
      useUploadPromptSaveQueue({
        editorKey: EDITOR_KEY,
        initialPrompt: "원본 프롬프트",
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
    expect(onSave).toHaveBeenNthCalledWith(
      1,
      "첫 번째 수정본",
      expect.any(AbortSignal),
    );

    await act(async () => {
      resolveFirstSave();
      await Promise.all([firstCommit, secondCommit]);
    });

    expect(onSave).toHaveBeenCalledTimes(2);
    expect(onSave).toHaveBeenNthCalledWith(
      2,
      "두 번째 수정본",
      expect.any(AbortSignal),
    );
  });

  it("같은 내용이 다시 대기 중이어도 중복 저장을 추가하지 않는다", async () => {
    const saveResolvers: Array<() => void> = [];
    const onSave = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          saveResolvers.push(resolve);
        }),
    );
    const { result } = renderHook(() =>
      useUploadPromptSaveQueue({
        editorKey: EDITOR_KEY,
        initialPrompt: "원본 프롬프트",
        onSave,
      }),
    );
    let firstCommit!: Promise<boolean>;
    let secondCommit!: Promise<boolean>;
    let thirdCommit!: Promise<boolean>;

    act(() => {
      firstCommit = result.current.commitPrompt("A 수정본");
      secondCommit = result.current.commitPrompt("B 수정본");
      thirdCommit = result.current.commitPrompt("A 수정본");
    });
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));

    act(() => saveResolvers[0]());
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(2));

    let duplicateCommit!: Promise<boolean>;
    act(() => {
      duplicateCommit = result.current.commitPrompt("A 수정본");
    });

    act(() => saveResolvers[1]());
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(3));
    act(() => saveResolvers[2]());

    await act(async () => {
      await Promise.all([
        firstCommit,
        secondCommit,
        thirdCommit,
        duplicateCommit,
      ]);
    });

    expect(await duplicateCommit).toBe(false);
    expect(onSave).toHaveBeenCalledTimes(3);
  });

  it("저장을 취소하면 진행 중인 요청과 대기 중인 요청을 중단한다", async () => {
    const onSave = vi.fn(
      (_content: string, signal?: AbortSignal) =>
        new Promise<void>((_resolve, reject) => {
          signal?.addEventListener("abort", () => {
            reject(new DOMException("저장 취소", "AbortError"));
          });
        }),
    );
    const { result } = renderHook(() =>
      useUploadPromptSaveQueue({
        editorKey: EDITOR_KEY,
        initialPrompt: "원본 프롬프트",
        onSave,
      }),
    );
    let activeCommit!: Promise<boolean>;
    let pendingCommit!: Promise<boolean>;

    act(() => {
      activeCommit = result.current.commitPrompt("첫 번째 수정본");
      pendingCommit = result.current.commitPrompt("두 번째 수정본");
    });
    await waitFor(() => expect(onSave).toHaveBeenCalledOnce());

    act(() => result.current.cancelPendingSaves(EDITOR_KEY));

    await act(async () => {
      await Promise.all([activeCommit, pendingCommit]);
    });

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave.mock.calls[0][1]?.aborted).toBe(true);
    expect(await activeCommit).toBe(false);
    expect(await pendingCommit).toBe(false);
  });
});
