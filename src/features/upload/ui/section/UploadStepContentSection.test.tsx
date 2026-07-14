import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadStepContentSection } from "./UploadStepContentSection";

vi.mock("../../hooks", async () => {
  const actual =
    await vi.importActual<typeof import("../../hooks")>("../../hooks");

  return {
    ...actual,
    useUploadStepData: () => ({
      isStepLoading: false,
      promptData: {
        editedPrompt: null,
        providedPromptSnapshot: "원본 프롬프트\n분량: 제한 없음",
        stepCode: "RESEARCH",
        stepName: "자료 조사",
      },
      resultData: null,
      savePrompt: vi.fn(),
      savePromptOnPageExit: vi.fn(),
    }),
    useUploadStepProject: () => ({
      isLastStep: false,
      stepCode: "RESEARCH",
    }),
    useUploadStepSubmission: () => ({
      isSubmitting: false,
      submitStepResult: vi.fn(),
    }),
  };
});

describe("UploadStepContentSection", () => {
  it("생성 프롬프트를 수정하고 작업 결과를 입력할 수 있다", () => {
    renderWithProviders(
      <UploadStepContentSection projectId="project-1" stepNum={1} />,
    );

    const promptEditor = screen.getByRole("textbox", { name: "수정 내용" });
    fireEvent.change(promptEditor, {
      target: { value: "수정된 프롬프트\n분량: A4 2장" },
    });

    expect(promptEditor).toHaveValue("수정된 프롬프트\n분량: A4 2장");
    expect(screen.getByText("작업 결과 입력")).toBeInTheDocument();
    expect(screen.queryByText("결과 추출")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "초기화" })).toHaveLength(1);
  });
});
