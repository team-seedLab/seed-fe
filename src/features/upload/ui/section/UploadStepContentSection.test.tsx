import { useState } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadStepContentSection } from "./UploadStepContentSection";

const { openSelfCheckMock } = vi.hoisted(() => ({
  openSelfCheckMock: vi.fn(),
}));

vi.mock("../../hooks", async () => {
  const actual =
    await vi.importActual<typeof import("../../hooks")>("../../hooks");

  return {
    ...actual,
    useUploadStepSubmission: () => ({
      isSubmitting: false,
      submitStep: vi.fn(),
    }),
    useUploadStepSelfCheck: () => ({
      answers: [],
      changeAnswer: vi.fn(),
      checkItems: [],
      closeSelfCheck: vi.fn(),
      isError: false,
      isLoading: false,
      isOpen: false,
      isValid: false,
      openSelfCheck: openSelfCheckMock,
      retrySelfCheck: vi.fn(),
    }),
  };
});

const originalPrompt = "원본 프롬프트\n분량: 제한 없음";

const UploadStepContentSectionTestHarness = () => {
  const [editedPrompt, setEditedPrompt] = useState(originalPrompt);
  const [resultText, setResultText] = useState("");

  return (
    <UploadStepContentSection
      editorFocusRequestId={null}
      isLastStep={false}
      isStepLoading={false}
      promptData={{
        addedCount: 0,
        createdAt: "2026-07-15T00:00:00",
        diffJson: null,
        editedPrompt: null,
        finalPrompt: originalPrompt,
        providedPromptSnapshot: originalPrompt,
        removedCount: 0,
        stepCode: "RESEARCH",
        stepId: "step-1",
        stepName: "자료 조사",
        updatedAt: "2026-07-15T00:00:00",
      }}
      promptEditor={{
        changePrompt: setEditedPrompt,
        commitPrompt: async () => true,
        editedPrompt,
        ensurePromptSaved: async () => true,
        resetPrompt: async () => {
          setEditedPrompt(originalPrompt);
          return true;
        },
      }}
      projectId="project-1"
      resultEditor={{
        changeResult: setResultText,
        commitResult: async () => true,
        ensureResultSaved: async () => true,
        resultText,
      }}
      stepCode="RESEARCH"
      stepNum={1}
    />
  );
};

describe("UploadStepContentSection", () => {
  it("생성 프롬프트를 수정하고 작업 결과를 입력할 수 있다", () => {
    renderWithProviders(<UploadStepContentSectionTestHarness />);

    const promptEditor = screen.getByRole("textbox", { name: "수정 내용" });
    fireEvent.change(promptEditor, {
      target: { value: "수정된 프롬프트\n분량: A4 2장" },
    });

    expect(promptEditor).toHaveValue("수정된 프롬프트\n분량: A4 2장");
    expect(screen.getByText("학습 결과 입력")).toBeInTheDocument();
    expect(screen.queryByText("결과 추출")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "초기화" })).toHaveLength(1);
  });

  it("작업 결과 입력 후 다음 단계 버튼을 누르면 Self-Check를 연다", () => {
    openSelfCheckMock.mockClear();
    renderWithProviders(<UploadStepContentSectionTestHarness />);

    fireEvent.change(screen.getByRole("textbox", { name: "학습 결과" }), {
      target: { value: "단계 작업 결과" },
    });
    fireEvent.click(screen.getByRole("button", { name: "다음 단계로 진행" }));

    expect(openSelfCheckMock).toHaveBeenCalledOnce();
  });
});
