import { InputRange } from "dom-input-range";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getTextareaSelectionAnchor } from "./get-textarea-selection-anchor";

describe("getTextareaSelectionAnchor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("텍스트 선택이 없으면 기준점을 만들지 않는다", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "학습 결과";
    textarea.setSelectionRange(2, 2);

    expect(getTextareaSelectionAnchor(textarea)).toBeNull();
  });

  it("현재 텍스트 선택 영역을 기준점 좌표로 제공한다", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "학습 결과";
    textarea.setSelectionRange(0, 2);
    const selectionRect = new DOMRect(24, 40, 80, 20);
    const fromSelection = vi.spyOn(InputRange, "fromSelection");
    const getBoundingClientRect = vi
      .spyOn(InputRange.prototype, "getBoundingClientRect")
      .mockReturnValue(selectionRect);

    const anchor = getTextareaSelectionAnchor(textarea);

    expect(anchor?.contextElement).toBe(textarea);
    expect(anchor?.getBoundingClientRect()).toBe(selectionRect);
    expect(fromSelection).toHaveBeenCalledWith(textarea);
    expect(getBoundingClientRect).toHaveBeenCalledOnce();
  });

  it("복제 영역 업데이트를 구독하고 해제한다", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "학습 결과";
    textarea.setSelectionRange(0, 2);
    const styleClone = InputRange.fromSelection(textarea).getStyleClone();
    const handlePositionUpdate = vi.fn();

    try {
      const anchor = getTextareaSelectionAnchor(textarea);
      const unsubscribe =
        anchor?.subscribeToPositionUpdates(handlePositionUpdate);

      styleClone.dispatchEvent(new Event("update"));

      expect(handlePositionUpdate).toHaveBeenCalledOnce();

      unsubscribe?.();
      styleClone.dispatchEvent(new Event("update"));

      expect(handlePositionUpdate).toHaveBeenCalledOnce();
    } finally {
      styleClone.disconnect();
    }
  });
});
