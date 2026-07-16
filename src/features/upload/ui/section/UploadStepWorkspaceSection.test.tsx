import type { ReactNode } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadStepWorkspaceSection } from "./UploadStepWorkspaceSection";

const {
  closePanelMock,
  ensurePromptSavedMock,
  openPanelMock,
  reaskWithEditedPromptMock,
  retryMessagesMock,
  sendQuestionMock,
} = vi.hoisted(() => ({
  closePanelMock: vi.fn(),
  ensurePromptSavedMock: vi.fn(),
  openPanelMock: vi.fn(),
  reaskWithEditedPromptMock: vi.fn(),
  retryMessagesMock: vi.fn(),
  sendQuestionMock: vi.fn(),
}));

vi.mock("../../components", async () => {
  const actual =
    await vi.importActual<typeof import("../../components")>(
      "../../components",
    );

  return {
    ...actual,
    UploadAiMentorResponsivePanel: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

vi.mock("../../hooks", async () => {
  const actual =
    await vi.importActual<typeof import("../../hooks")>("../../hooks");
  const { useState } = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useUploadAiMentorConversation: () => ({
      changeDraft: vi.fn(),
      draft: "",
      hasPromptChanges: true,
      isError: false,
      isLoading: false,
      isSending: false,
      messages: [
        {
          aiMessageId: "assistant-1",
          content: "프롬프트를 보완해 보세요.",
          createdAt: "2026-07-15T00:00:00",
          inputTokens: null,
          messageType: "CHAT",
          outputTokens: null,
          sender: "ASSISTANT",
          totalTokens: null,
          turnId: "turn-1",
        },
      ],
      pendingContent: null,
      reaskWithEditedPrompt: reaskWithEditedPromptMock,
      retryMessages: retryMessagesMock,
      sendQuestion: sendQuestionMock,
    }),
    useUploadAiMentorPanel: () => {
      const [isOpen, setIsOpen] = useState(true);

      return {
        closePanel: () => {
          closePanelMock();
          setIsOpen(false);
        },
        isOpen,
        isSplitScreen: false,
        openPanel: () => {
          openPanelMock();
          setIsOpen(true);
        },
      };
    },
    useUploadAiMentorResize: () => ({
      handleResizeKeyDown: vi.fn(),
      handleResizePointerCancel: vi.fn(),
      handleResizePointerDown: vi.fn(),
      handleResizePointerMove: vi.fn(),
      handleResizePointerUp: vi.fn(),
      isResizing: false,
      maxPanelWidth: 794,
      minPanelWidth: 360,
      panelWidth: 794,
    }),
    useUploadPromptEditor: () => ({
      changePrompt: vi.fn(),
      commitPrompt: vi.fn(),
      editedPrompt: "수정 프롬프트",
      ensurePromptSaved: ensurePromptSavedMock,
      resetPrompt: vi.fn(),
    }),
    useUploadStepResultEditor: () => ({
      changeResult: vi.fn(),
      commitResult: vi.fn(),
      ensureResultSaved: vi.fn(),
      resultText: "",
    }),
    useUploadStepData: () => ({
      isStepLoading: false,
      promptData: {
        editedPrompt: "수정 프롬프트",
        providedPromptSnapshot: "원본 프롬프트",
      },
      resultData: null,
      savePrompt: vi.fn(),
      savePromptOnPageExit: vi.fn(),
      saveResult: vi.fn(),
      saveResultOnPageExit: vi.fn(),
    }),
    useUploadStepProject: ({ stepNum }: { stepNum: number }) => ({
      isLastStep: false,
      isLoading: false,
      stepCode: `STEP_${stepNum}`,
    }),
  };
});

vi.mock("./UploadStepContentSection", async () => {
  const { useEffect, useRef } =
    await vi.importActual<typeof import("react")>("react");

  return {
    UploadStepContentSection: ({
      editorFocusRequestId,
    }: {
      editorFocusRequestId: number | null;
    }) => {
      const editorRef = useRef<HTMLTextAreaElement>(null);

      useEffect(() => {
        if (editorFocusRequestId !== null) {
          editorRef.current?.focus();
        }
      }, [editorFocusRequestId]);

      return (
        <textarea
          aria-label="수정 내용"
          data-focus-request-id={editorFocusRequestId ?? ""}
          ref={editorRef}
        />
      );
    },
  };
});

vi.mock("./UploadStepHeaderSection", () => ({
  UploadStepHeaderSection: () => <div>단계 헤더</div>,
}));

describe("UploadStepWorkspaceSection", () => {
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("작은 화면에서 프롬프트 수정 요청 시 패널을 닫고 편집기로 이동한다", () => {
    renderWithProviders(
      <UploadStepWorkspaceSection projectId="project-1" stepNum={1} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "프롬프트 수정하기" }));

    expect(closePanelMock).toHaveBeenCalledOnce();
    expect(screen.getByRole("textbox", { name: "수정 내용" })).toHaveFocus();
  });

  it("단계 전환 시 이전 단계의 편집기 포커스 요청을 전달하지 않는다", () => {
    const { rerender } = renderWithProviders(
      <UploadStepWorkspaceSection projectId="project-1" stepNum={1} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "프롬프트 수정하기" }));
    expect(screen.getByRole("textbox", { name: "수정 내용" })).toHaveFocus();

    rerender(<UploadStepWorkspaceSection projectId="project-1" stepNum={2} />);

    expect(screen.getByRole("textbox", { name: "수정 내용" })).toHaveAttribute(
      "data-focus-request-id",
      "",
    );

    rerender(<UploadStepWorkspaceSection projectId="project-1" stepNum={1} />);

    expect(screen.getByRole("textbox", { name: "수정 내용" })).toHaveAttribute(
      "data-focus-request-id",
      "",
    );
  });
});
