import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadAiMentorAssistantMessage } from "./UploadAiMentorAssistantMessage";

const clipboardWriteTextMock = vi.fn();
const originalClipboardDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  "clipboard",
);

describe("UploadAiMentorAssistantMessage", () => {
  afterAll(() => {
    if (originalClipboardDescriptor) {
      Object.defineProperty(
        navigator,
        "clipboard",
        originalClipboardDescriptor,
      );
      return;
    }

    Reflect.deleteProperty(navigator, "clipboard");
  });

  beforeEach(() => {
    clipboardWriteTextMock.mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: clipboardWriteTextMock,
      },
    });
  });

  it("AI 답변의 원본 마크다운을 복사한다", async () => {
    const content = `## 분석 결과

| 항목 | 내용 |
| --- | --- |
| 단계 | 제약사항 분석 |

### 다음 질문 가이드
- 자료 범위를 보완해 주세요.`;

    renderWithProviders(
      <UploadAiMentorAssistantMessage
        content={content}
        hasPromptChanges={false}
        isLatest={false}
        isSending={false}
        onEditPrompt={vi.fn()}
        onReask={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "복사하기" }));

    await waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledWith(content);
    });
    expect(
      screen.getByRole("button", { name: "복사됨 ✓" }),
    ).toBeInTheDocument();
  });
});
