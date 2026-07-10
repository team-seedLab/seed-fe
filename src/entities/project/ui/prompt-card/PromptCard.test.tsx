import { useState } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { PromptCard } from "./PromptCard";

const ORIGINAL_PROMPT = "첫 번째 줄\n분량: 제한 없음\n마지막 줄";
const EDITED_PROMPT = "첫 번째 줄\n분량: A4 2장\n마지막 줄";

const ResettablePromptCard = () => {
  const [content, setContent] = useState(EDITED_PROMPT);

  return (
    <PromptCard
      content={content}
      label="수정 내용"
      mode="editable"
      originalContent={ORIGINAL_PROMPT}
      onCommit={vi.fn()}
      onContentChange={setContent}
      onCopy={vi.fn()}
      onReset={() => setContent(ORIGINAL_PROMPT)}
    />
  );
};

const EditablePromptCard = () => {
  const [content, setContent] = useState(ORIGINAL_PROMPT);

  return (
    <PromptCard
      content={content}
      label="수정 내용"
      mode="editable"
      originalContent={ORIGINAL_PROMPT}
      onCommit={vi.fn()}
      onContentChange={setContent}
      onCopy={vi.fn()}
      onReset={() => setContent(ORIGINAL_PROMPT)}
    />
  );
};

describe("PromptCard", () => {
  it("기존 읽기 전용 카드의 내용과 복사 기능을 유지한다", () => {
    const onCopy = vi.fn();

    renderWithProviders(
      <PromptCard
        content={ORIGINAL_PROMPT}
        label="생성된 프롬프트"
        onCopy={onCopy}
      />,
    );

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "복사하기" }));
    expect(onCopy).toHaveBeenCalledOnce();
  });

  it("편집 모드에서 수정본 변경과 초기화를 전달한다", () => {
    const onContentChange = vi.fn();
    const onReset = vi.fn();

    renderWithProviders(
      <PromptCard
        content={EDITED_PROMPT}
        label="수정 내용"
        mode="editable"
        originalContent={ORIGINAL_PROMPT}
        onCommit={vi.fn()}
        onContentChange={onContentChange}
        onCopy={vi.fn()}
        onReset={onReset}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "수정 내용" });
    fireEvent.change(editor, { target: { value: "새로운 수정본" } });
    fireEvent.click(screen.getByRole("button", { name: "초기화" }));

    expect(onContentChange).toHaveBeenCalledWith("새로운 수정본");
    expect(onReset).toHaveBeenCalledOnce();
  });

  it("수정된 내용이 있을 때 차이보기와 초기화를 활성화한다", () => {
    renderWithProviders(<EditablePromptCard />);

    const diffButton = screen.getByRole("button", { name: "차이보기" });
    const resetButton = screen.getByRole("button", { name: "초기화" });

    expect(diffButton).toBeDisabled();
    expect(resetButton).toBeDisabled();

    fireEvent.change(screen.getByRole("textbox", { name: "수정 내용" }), {
      target: { value: EDITED_PROMPT },
    });

    expect(diffButton).toBeEnabled();
    expect(resetButton).toBeEnabled();
  });

  it("원본과 수정본의 추가 및 삭제 줄을 표시한다", () => {
    renderWithProviders(
      <PromptCard
        content={EDITED_PROMPT}
        label="수정 내용"
        mode="editable"
        originalContent={ORIGINAL_PROMPT}
        onCommit={vi.fn()}
        onContentChange={vi.fn()}
        onCopy={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByText("추가 1")).toBeInTheDocument();
    expect(screen.getByText("삭제 1")).toBeInTheDocument();

    const diffButton = screen.getByRole("button", { name: "차이보기" });
    fireEvent.click(diffButton);

    expect(diffButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("- 분량: 제한 없음")).toBeInTheDocument();
    expect(screen.getByText("+ 분량: A4 2장")).toBeInTheDocument();
  });

  it("카드 내부로 포커스가 이동할 때는 저장하지 않는다", () => {
    const onCommit = vi.fn();

    renderWithProviders(
      <PromptCard
        content={EDITED_PROMPT}
        label="수정 내용"
        mode="editable"
        originalContent={ORIGINAL_PROMPT}
        onCommit={onCommit}
        onContentChange={vi.fn()}
        onCopy={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    const editor = screen.getByRole("textbox", { name: "수정 내용" });
    const resetButton = screen.getByRole("button", { name: "초기화" });
    fireEvent.blur(editor, { relatedTarget: resetButton });

    expect(onCommit).not.toHaveBeenCalled();
  });

  it("카드 밖으로 포커스가 이동하면 현재 수정본을 저장 요청한다", () => {
    const onCommit = vi.fn();

    renderWithProviders(
      <>
        <PromptCard
          content={EDITED_PROMPT}
          label="수정 내용"
          mode="editable"
          originalContent={ORIGINAL_PROMPT}
          onCommit={onCommit}
          onContentChange={vi.fn()}
          onCopy={vi.fn()}
          onReset={vi.fn()}
        />
        <button type="button">카드 외부</button>
      </>,
    );

    const editor = screen.getByRole("textbox", { name: "수정 내용" });
    const outsideButton = screen.getByRole("button", { name: "카드 외부" });
    fireEvent.blur(editor, { relatedTarget: outsideButton });

    expect(onCommit).toHaveBeenCalledWith(EDITED_PROMPT);
  });

  it("비교 모드에서는 수정과 초기화 없이 diff만 확인한다", () => {
    renderWithProviders(
      <PromptCard
        content={EDITED_PROMPT}
        label="최종 프롬프트"
        mode="comparison"
        originalContent={ORIGINAL_PROMPT}
        onCopy={vi.fn()}
      />,
    );

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "초기화" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "차이보기" }));
    expect(screen.getByText("- 분량: 제한 없음")).toBeInTheDocument();
    expect(screen.getByText("+ 분량: A4 2장")).toBeInTheDocument();
  });

  it("diff 화면에서 초기화하면 편집 화면으로 돌아간다", () => {
    renderWithProviders(<ResettablePromptCard />);

    fireEvent.click(screen.getByRole("button", { name: "차이보기" }));
    fireEvent.click(screen.getByRole("button", { name: "초기화" }));

    expect(screen.getByRole("textbox", { name: "수정 내용" })).toHaveValue(
      ORIGINAL_PROMPT,
    );
    expect(screen.getByRole("button", { name: "차이보기" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
