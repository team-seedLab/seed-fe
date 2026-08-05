import { act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { ProjectStepResultFloatingToolbar } from "./ProjectStepResultFloatingToolbar";
import type { TextareaSelectionAnchor } from "./get-textarea-selection-anchor";

describe("ProjectStepResultFloatingToolbar", () => {
  it("선택 좌표 업데이트를 구독해 위치를 다시 계산하고 구독을 해제한다", async () => {
    const textarea = document.createElement("textarea");
    const unsubscribe = vi.fn();
    let handlePositionUpdate: (() => void) | undefined;
    const getBoundingClientRect = vi.fn(() => new DOMRect(80, 120, 160, 24));
    const anchor: TextareaSelectionAnchor = {
      contextElement: textarea,
      getBoundingClientRect,
      subscribeToPositionUpdates: vi.fn((listener: () => void) => {
        handlePositionUpdate = listener;
        return unsubscribe;
      }),
    };
    document.body.appendChild(textarea);

    try {
      const { unmount } = renderWithProviders(
        <ProjectStepResultFloatingToolbar
          anchor={anchor}
          textareaId="result-input"
        />,
      );

      await waitFor(() => {
        expect(anchor.subscribeToPositionUpdates).toHaveBeenCalledOnce();
      });
      const previousCallCount = getBoundingClientRect.mock.calls.length;

      act(() => handlePositionUpdate?.());

      await waitFor(() => {
        expect(getBoundingClientRect.mock.calls.length).toBeGreaterThan(
          previousCallCount,
        );
      });

      unmount();

      expect(unsubscribe).toHaveBeenCalledOnce();
    } finally {
      textarea.remove();
    }
  });
});
