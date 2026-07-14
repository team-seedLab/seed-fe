import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadSelfCheckDialog } from "./UploadSelfCheckDialog";

const CHECK_ITEMS = [
  {
    key: "core_understanding",
    question: "핵심 내용을 설명해 주세요.",
    answer: "충분히 길게 작성한 첫 번째 답변입니다.",
  },
  {
    key: "result_application",
    question: "결과물에 어떻게 적용했나요?",
    answer: "충분히 길게 작성한 두 번째 답변입니다.",
  },
  {
    key: "uncertainty_review",
    question: "다시 확인할 부분은 무엇인가요?",
    answer: "충분히 길게 작성한 세 번째 답변입니다.",
  },
];

describe("UploadSelfCheckDialog", () => {
  it("Self-Check 질문과 저장된 답변을 모달에 표시한다", () => {
    renderWithProviders(
      <UploadSelfCheckDialog
        checkItems={CHECK_ITEMS}
        isError={false}
        isLoading={false}
        isOpen
        isSubmitting={false}
        isValid
        onAnswerChange={vi.fn()}
        onOpenChange={vi.fn()}
        onRetry={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "이해 확인 및 검증" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: CHECK_ITEMS[0].question }),
    ).toHaveValue(CHECK_ITEMS[0].answer);
  });

  it("질문 답변 변경과 검증 완료 요청을 전달한다", () => {
    const onAnswerChange = vi.fn();
    const onSubmit = vi.fn();
    renderWithProviders(
      <UploadSelfCheckDialog
        checkItems={CHECK_ITEMS}
        isError={false}
        isLoading={false}
        isOpen
        isSubmitting={false}
        isValid
        onAnswerChange={onAnswerChange}
        onOpenChange={vi.fn()}
        onRetry={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(
      screen.getByRole("textbox", { name: CHECK_ITEMS[0].question }),
      { target: { value: "수정한 답변입니다." } },
    );
    fireEvent.click(screen.getByRole("button", { name: "검증완료" }));

    expect(onAnswerChange).toHaveBeenCalledWith(
      "core_understanding",
      "수정한 답변입니다.",
    );
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
