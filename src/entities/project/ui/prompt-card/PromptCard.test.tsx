import { useState } from "react";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

const FocusablePromptCard = () => {
  const [editorFocusRequestId, setEditorFocusRequestId] = useState<
    number | null
  >(null);

  return (
    <>
      <PromptCard
        content={EDITED_PROMPT}
        editorFocusRequestId={editorFocusRequestId}
        label="수정 내용"
        mode="editable"
        originalContent={ORIGINAL_PROMPT}
        onCommit={vi.fn()}
        onContentChange={vi.fn()}
        onCopy={vi.fn()}
        onReset={vi.fn()}
      />
      <button
        type="button"
        onClick={() =>
          setEditorFocusRequestId((currentRequestId) =>
            currentRequestId === null ? 1 : currentRequestId + 1,
          )
        }
      >
        프롬프트 편집 요청
      </button>
    </>
  );
};

describe("PromptCard", () => {
  it("편집 내용에 따라 입력창 높이를 자동으로 조절한다", async () => {
    renderWithProviders(<EditablePromptCard />);

    const editor = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "수정 내용",
    });
    Object.defineProperty(editor, "scrollHeight", {
      configurable: true,
      value: 360,
    });

    fireEvent.input(editor, {
      target: { value: "여러 줄로 작성한 수정 프롬프트" },
    });

    await waitFor(() => {
      expect(editor).toHaveStyle({ height: "360px", resize: "none" });
    });
  });

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
  });

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

  it("문서형 내용의 긴 문자열을 카드 너비 안에서 줄바꿈한다", () => {
    const longContent = "https://example.com/".repeat(20);

    renderWithProviders(
      <PromptCard
        content={longContent}
        contentVariant="document"
        label="수정 내용"
        onCopy={vi.fn()}
      />,
    );

    expect(screen.getByText(longContent)).toHaveStyle({
      overflowWrap: "anywhere",
    });
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
    const disabledButtonStyle = window.getComputedStyle(diffButton);

    expect(disabledButtonStyle.borderWidth).toBe("1px");
    expect(disabledButtonStyle.borderStyle).toBe("solid");

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

  it("diff 화면에서 편집 요청을 받으면 편집 화면으로 돌아가 포커스한다", async () => {
    renderWithProviders(<FocusablePromptCard />);

    fireEvent.click(screen.getByRole("button", { name: "차이보기" }));
    expect(
      screen.queryByRole("textbox", { name: "수정 내용" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "프롬프트 편집 요청" }));

    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "수정 내용" })).toHaveFocus(),
    );
    expect(screen.getByRole("button", { name: "차이보기" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
