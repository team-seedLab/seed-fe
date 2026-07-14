import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadAiMentorResponsivePanel } from "./UploadAiMentorResponsivePanel";

const resizeProps = {
  isResizing: false,
  maxPanelWidth: 794,
  minPanelWidth: 360,
  panelWidth: 794,
  onResizeKeyDown: vi.fn(),
  onResizePointerCancel: vi.fn(),
  onResizePointerDown: vi.fn(),
  onResizePointerMove: vi.fn(),
  onResizePointerUp: vi.fn(),
};

describe("UploadAiMentorResponsivePanel", () => {
  it("분할 화면에서는 크기 조절 경계와 AI 패널을 함께 표시한다", () => {
    renderWithProviders(
      <UploadAiMentorResponsivePanel
        {...resizeProps}
        isOpen
        isSplitScreen
        onOpen={vi.fn()}
      >
        <div>AI 패널</div>
      </UploadAiMentorResponsivePanel>,
    );

    const separator = screen.getByRole("separator", {
      name: "AI 멘토 영역 크기 조절",
    });
    expect(separator).toHaveAttribute("aria-valuemin", "360");
    expect(separator).toHaveAttribute("aria-valuemax", "794");
    expect(separator).toHaveAttribute("aria-valuenow", "794");
    expect(screen.getByText("AI 패널")).toBeVisible();
  });

  it("좁은 화면에서는 오버레이 없이 AI 패널만 페이지 영역에 표시한다", () => {
    renderWithProviders(
      <UploadAiMentorResponsivePanel
        {...resizeProps}
        isOpen
        isSplitScreen={false}
        onOpen={vi.fn()}
      >
        <div>AI 패널</div>
      </UploadAiMentorResponsivePanel>,
    );

    expect(screen.getByText("AI 패널")).toBeVisible();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });

  it("패널이 닫혀 있으면 열기 버튼을 표시한다", () => {
    const onOpen = vi.fn();
    renderWithProviders(
      <UploadAiMentorResponsivePanel
        {...resizeProps}
        isOpen={false}
        isSplitScreen
        onOpen={onOpen}
      >
        <div>AI 패널</div>
      </UploadAiMentorResponsivePanel>,
    );

    fireEvent.click(screen.getByRole("button", { name: "AI 멘토 열기" }));

    expect(onOpen).toHaveBeenCalledOnce();
    expect(screen.queryByText("AI 패널")).not.toBeInTheDocument();
  });
});
