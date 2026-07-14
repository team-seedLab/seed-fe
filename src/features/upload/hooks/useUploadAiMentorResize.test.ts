import type { KeyboardEvent, PointerEvent, RefObject } from "react";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useUploadAiMentorResize } from "./useUploadAiMentorResize";

const createKeyboardEvent = (key: string) =>
  ({
    key,
    preventDefault: vi.fn(),
  }) as unknown as KeyboardEvent<HTMLDivElement>;

describe("useUploadAiMentorResize", () => {
  const containerRef = {
    current: null,
  } as RefObject<HTMLElement | null>;

  it("방향키와 Home, End 키로 패널 너비를 조절한다", () => {
    const { result } = renderHook(() =>
      useUploadAiMentorResize({ containerRef, enabled: true }),
    );

    expect(result.current.panelWidth).toBe(794);

    act(() => {
      result.current.handleResizeKeyDown(createKeyboardEvent("ArrowRight"));
    });
    expect(result.current.panelWidth).toBe(770);

    act(() => {
      result.current.handleResizeKeyDown(createKeyboardEvent("ArrowLeft"));
    });
    expect(result.current.panelWidth).toBe(794);

    act(() => {
      result.current.handleResizeKeyDown(createKeyboardEvent("End"));
    });
    expect(result.current.panelWidth).toBe(360);

    act(() => {
      result.current.handleResizeKeyDown(createKeyboardEvent("Home"));
    });
    expect(result.current.panelWidth).toBe(794);
  });

  it("좁은 분할 화면에서는 메인 영역을 보존하도록 패널 최대 너비를 줄인다", () => {
    const container = document.createElement("div");
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      width: 976,
    } as DOMRect);
    const narrowContainerRef = {
      current: container,
    } as RefObject<HTMLElement | null>;

    const { result } = renderHook(() =>
      useUploadAiMentorResize({
        containerRef: narrowContainerRef,
        enabled: true,
      }),
    );

    expect(result.current.maxPanelWidth).toBe(368);
    expect(result.current.panelWidth).toBe(368);
  });

  it("경계를 왼쪽으로 드래그하면 패널을 최대 너비까지 넓힌다", () => {
    const { result } = renderHook(() =>
      useUploadAiMentorResize({ containerRef, enabled: true }),
    );
    const currentTarget = {
      hasPointerCapture: vi.fn().mockReturnValue(true),
      releasePointerCapture: vi.fn(),
      setPointerCapture: vi.fn(),
    };
    const createPointerEvent = (clientX: number) =>
      ({
        clientX,
        currentTarget,
        pointerId: 1,
        preventDefault: vi.fn(),
      }) as unknown as PointerEvent<HTMLDivElement>;

    act(() => {
      result.current.handleResizePointerDown(createPointerEvent(600));
    });
    expect(result.current.isResizing).toBe(true);

    act(() => {
      result.current.handleResizePointerMove(createPointerEvent(500));
    });
    expect(result.current.panelWidth).toBe(794);

    act(() => {
      result.current.handleResizePointerUp(createPointerEvent(500));
    });
    expect(result.current.isResizing).toBe(false);
    expect(currentTarget.releasePointerCapture).toHaveBeenCalledWith(1);
  });
});
