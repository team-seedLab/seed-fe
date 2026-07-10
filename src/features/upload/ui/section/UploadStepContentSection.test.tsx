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
      stepData: {
        formatPrompt: "# 결과 추출 프롬프트",
        providedPromptSnapshot: "원본 프롬프트\n분량: 제한 없음",
        stepCode: "RESEARCH",
        stepName: "자료 조사",
        userSubmittedResult: null,
      },
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
  it("생성 프롬프트만 수정할 수 있고 추출 프롬프트는 읽기 전용으로 유지한다", () => {
    renderWithProviders(
      <UploadStepContentSection projectId="project-1" stepNum={1} />,
    );

    const promptEditor = screen.getByRole("textbox", { name: "수정 내용" });
    fireEvent.change(promptEditor, {
      target: { value: "수정된 프롬프트\n분량: A4 2장" },
    });

    expect(promptEditor).toHaveValue("수정된 프롬프트\n분량: A4 2장");
    expect(screen.getByText("# 결과 추출 프롬프트")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "초기화" })).toHaveLength(1);
  });
});
