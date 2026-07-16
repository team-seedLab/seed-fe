import { useState } from "react";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { ProjectStepAiMessage } from "@/entities";
import { renderWithProviders } from "@/test/test-utils";

import { UploadAiMentorPanel } from "./UploadAiMentorPanel";

const createMessage = (
  aiMessageId: string,
  sender: ProjectStepAiMessage["sender"],
  content: string,
): ProjectStepAiMessage => ({
  aiMessageId,
  content,
  createdAt: "2026-07-15T00:00:00",
  inputTokens: null,
  messageType: "CHAT",
  outputTokens: null,
  sender,
  totalTokens: null,
  turnId: `turn-${aiMessageId}`,
});

const UploadAiMentorPanelTestHarness = ({ onSend }: { onSend: () => void }) => {
  const [draft, setDraft] = useState("");

  return (
    <UploadAiMentorPanel
      draft={draft}
      hasPromptChanges={false}
      isError={false}
      isLoading={false}
      isSending={false}
      messages={[]}
      pendingContent={null}
      onChangeDraft={setDraft}
      onClose={vi.fn()}
      onEditPrompt={vi.fn()}
      onReask={vi.fn()}
      onRetry={vi.fn()}
      onSend={onSend}
    />
  );
};

describe("UploadAiMentorPanel", () => {
  it("AI 답변의 GFM 표를 렌더링한다", () => {
    renderWithProviders(
      <UploadAiMentorPanel
        draft=""
        hasPromptChanges={false}
        isError={false}
        isLoading={false}
        isSending={false}
        messages={[
          createMessage(
            "assistant-1",
            "ASSISTANT",
            `| 항목 | 내용 |
| --- | --- |
| 단계 | 제약사항 분석 |`,
          ),
        ]}
        pendingContent={null}
        onChangeDraft={vi.fn()}
        onClose={vi.fn()}
        onEditPrompt={vi.fn()}
        onReask={vi.fn()}
        onRetry={vi.fn()}
        onSend={vi.fn()}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "항목" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "제약사항 분석" }),
    ).toBeInTheDocument();
  });

  it("질문 내용에 따라 입력창 높이를 최대 360px까지 자동으로 조절한다", async () => {
    renderWithProviders(<UploadAiMentorPanelTestHarness onSend={vi.fn()} />);

    const composer = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "AI 멘토에게 질문하기",
    });
    Object.defineProperty(composer, "scrollHeight", {
      configurable: true,
      value: 180,
    });

    fireEvent.input(composer, {
      target: { value: "여러 줄로 작성한 AI 멘토 질문" },
    });

    await waitFor(() => {
      expect(composer.style.height).not.toBe("");
      expect(composer).toHaveStyle({
        maxHeight: "360px",
        overflowY: "hidden",
        resize: "none",
      });
    });
    expect(composer.parentElement).toHaveStyle({ minHeight: "95px" });
  });

  it("질문 내용이 최대 높이를 넘으면 입력창 내부를 스크롤한다", async () => {
    const getComputedStyle = window.getComputedStyle.bind(window);
    const getComputedStyleSpy = vi
      .spyOn(window, "getComputedStyle")
      .mockImplementation((element, pseudoElement) => {
        const style = getComputedStyle(element, pseudoElement);

        if (!(element instanceof HTMLTextAreaElement)) {
          return style;
        }

        return new Proxy(style, {
          get(target, property) {
            const textareaStyle = {
              borderBottomWidth: "0px",
              borderTopWidth: "0px",
              boxSizing: "border-box",
              maxHeight: "360px",
              overflowY: "hidden",
            } as const;

            if (property in textareaStyle) {
              return textareaStyle[property as keyof typeof textareaStyle];
            }

            const value = Reflect.get(target, property, target);

            return typeof value === "function" ? value.bind(target) : value;
          },
        });
      });

    try {
      renderWithProviders(<UploadAiMentorPanelTestHarness onSend={vi.fn()} />);

      const composer = screen.getByRole<HTMLTextAreaElement>("textbox", {
        name: "AI 멘토에게 질문하기",
      });
      Object.defineProperty(composer, "scrollHeight", {
        configurable: true,
        value: 420,
      });

      fireEvent.input(composer, {
        target: { value: "최대 높이를 넘는 여러 줄의 AI 멘토 질문" },
      });

      await waitFor(() => {
        expect(composer.style.height).toBe("360px");
      });
      expect(composer.style.overflowY).toBe("scroll");
    } finally {
      getComputedStyleSpy.mockRestore();
    }
  });

  it("빈 대화에서 질문을 입력하고 Enter로 전송한다", () => {
    const onSend = vi.fn();
    renderWithProviders(<UploadAiMentorPanelTestHarness onSend={onSend} />);

    expect(screen.getByText("AI 멘토에게 질문해 보세요")).toBeInTheDocument();

    const composer = screen.getByRole("textbox", {
      name: "AI 멘토에게 질문하기",
    });
    fireEvent.change(composer, { target: { value: "자료 범위를 알려줘" } });
    fireEvent.keyDown(composer, { key: "Enter" });

    expect(onSend).toHaveBeenCalledOnce();
  });

  it("최신 AI 답변에만 프롬프트 후속 동작을 표시한다", () => {
    const messages = [
      createMessage("user-1", "USER", "첫 질문"),
      createMessage("assistant-1", "ASSISTANT", "첫 답변"),
      createMessage("user-2", "USER", "두 번째 질문"),
      createMessage(
        "assistant-2",
        "ASSISTANT",
        `두 번째 답변

### 다음 질문 가이드
- 보완할 정보: 자료 범위`,
      ),
    ];

    renderWithProviders(
      <UploadAiMentorPanel
        draft=""
        hasPromptChanges={false}
        isError={false}
        isLoading={false}
        isSending={false}
        messages={messages}
        pendingContent={null}
        onChangeDraft={vi.fn()}
        onClose={vi.fn()}
        onEditPrompt={vi.fn()}
        onReask={vi.fn()}
        onRetry={vi.fn()}
        onSend={vi.fn()}
      />,
    );

    expect(screen.getByText("프롬프트 개선 가이드")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "프롬프트 수정하기" }),
    ).toHaveLength(1);
    expect(
      screen.getByRole("button", {
        name: "수정한 프롬프트로 다시 묻기",
      }),
    ).toBeDisabled();
  });

  it("프롬프트가 변경되면 수정본 재질문을 활성화한다", () => {
    const onReask = vi.fn();

    renderWithProviders(
      <UploadAiMentorPanel
        draft=""
        hasPromptChanges
        isError={false}
        isLoading={false}
        isSending={false}
        messages={[
          createMessage(
            "assistant-1",
            "ASSISTANT",
            "프롬프트를 보완해 보세요.",
          ),
        ]}
        pendingContent={null}
        onChangeDraft={vi.fn()}
        onClose={vi.fn()}
        onEditPrompt={vi.fn()}
        onReask={onReask}
        onRetry={vi.fn()}
        onSend={vi.fn()}
      />,
    );

    const reaskButton = screen.getByRole("button", {
      name: "수정한 프롬프트로 다시 묻기",
    });
    expect(reaskButton).toBeEnabled();

    fireEvent.click(reaskButton);

    expect(onReask).toHaveBeenCalledOnce();
  });
});
