import { useState } from "react";

import {
  createEvent,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { ProjectStepResultCard } from "./ProjectStepResultCard";

type HarnessProps = {
  initialContent?: string;
};

const ProjectStepResultCardTestHarness = ({
  initialContent = "",
}: HarnessProps) => {
  const [content, setContent] = useState(initialContent);

  return (
    <ProjectStepResultCard
      content={content}
      mode="editable"
      onContentChange={setContent}
    />
  );
};

const renderEditableResult = (initialContent?: string) => {
  renderWithProviders(
    <ProjectStepResultCardTestHarness initialContent={initialContent} />,
  );
};

const selectView = async (name: "입력" | "미리보기") => {
  const tab = screen.getByRole("tab", { name });

  fireEvent.click(tab);
  await waitFor(() => {
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("tabpanel", { hidden: true, name }),
    ).not.toHaveAttribute("hidden");
  });
};

describe("ProjectStepResultCard", () => {
  it("미리보기에서 GFM 표를 렌더링한다", async () => {
    renderEditableResult(`| 항목 | 내용 |
| --- | --- |
| 단계 | 제약사항 분석 |`);

    await selectView("미리보기");

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "항목" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "제약사항 분석" }),
    ).toBeInTheDocument();
  });

  it("편집 모드에서 입력과 미리보기를 전환해도 입력값을 유지한다", async () => {
    renderEditableResult("기존 학습 결과");

    const resultInput = screen.getByRole("textbox", { name: "학습 결과" });

    expect(resultInput).toHaveValue("기존 학습 결과");

    fireEvent.change(resultInput, {
      target: { value: "수정한 학습 결과" },
    });
    await selectView("미리보기");
    await selectView("입력");

    expect(
      await screen.findByRole("textbox", { name: "학습 결과" }),
    ).toHaveValue("수정한 학습 결과");
  });

  it("미리보기에서 학습 결과 마크다운을 렌더링한다", async () => {
    renderEditableResult("# 제목\n\n**강조**\n\n*기울임*\n\n- 첫 번째 항목");

    await selectView("미리보기");

    expect(
      screen.getByRole("heading", { level: 3, name: "제목" }),
    ).toBeInTheDocument();
    expect(screen.getByText("강조").tagName).toBe("STRONG");
    expect(screen.getByText("기울임")).toHaveStyle({ fontStyle: "italic" });
    expect(screen.getByRole("listitem")).toHaveTextContent("첫 번째 항목");
  });

  it("입력값이 없으면 빈 미리보기 안내를 보여준다", async () => {
    renderEditableResult();

    await selectView("미리보기");

    expect(screen.getByText("미리보기할 학습 결과가 없습니다.")).toBeVisible();
  });

  it("입력 내용에 따라 입력창 높이를 자동으로 조절한다", async () => {
    renderEditableResult();

    const resultInput = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "학습 결과",
    });
    Object.defineProperty(resultInput, "scrollHeight", {
      configurable: true,
      value: 320,
    });

    fireEvent.input(resultInput, {
      target: { value: "여러 줄로 작성한 학습 결과" },
    });

    await waitFor(() => {
      expect(resultInput).toHaveStyle({ height: "320px", resize: "none" });
    });
  });

  it("번호 목록의 시작 번호를 미리보기에 유지한다", async () => {
    renderEditableResult("3. 세 번째\n4. 네 번째");

    await selectView("미리보기");

    expect(screen.getByRole("list")).toHaveAttribute("start", "3");
  });

  it("목록을 종료한 뒤 입력한 내용은 목록 밖에 표시한다", async () => {
    const listValue = "1. 1번\n2. 2번\n3. ";

    renderEditableResult(listValue);

    const resultInput = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "학습 결과",
    });
    resultInput.setSelectionRange(listValue.length, listValue.length);

    fireEvent.keyDown(resultInput, { key: "Enter" });

    expect(resultInput).toHaveValue("1. 1번\n2. 2번\n\n");

    fireEvent.change(resultInput, {
      target: { value: "1. 1번\n2. 2번\n\n**굵게**" },
    });
    await selectView("미리보기");

    expect(screen.getByText("굵게").closest("li")).toBeNull();
  });

  it.each([
    {
      expected: "**강조**",
      key: "b",
      label: "굵게",
      value: "강조",
    },
    {
      expected: "*기울임*",
      key: "i",
      label: "기울임",
      value: "기울임",
    },
    {
      expected: "[링크](url)",
      key: "k",
      label: "링크",
      value: "링크",
    },
  ])("Ctrl/Cmd+$key로 $label 문법을 입력한다", ({ expected, key, value }) => {
    renderEditableResult(value);

    const resultInput = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "학습 결과",
    });
    resultInput.setSelectionRange(0, value.length);

    fireEvent.keyDown(resultInput, { ctrlKey: true, key });

    expect(resultInput).toHaveValue(expected);
  });

  it("Tab과 Shift+Tab으로 선택한 줄을 들여쓰고 내어쓴다", () => {
    renderEditableResult("첫째 줄\n둘째 줄");

    const resultInput = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "학습 결과",
    });
    resultInput.setSelectionRange(0, resultInput.value.length);

    fireEvent.keyDown(resultInput, { code: "Tab", key: "Tab" });

    expect(resultInput).toHaveValue("    첫째 줄\n    둘째 줄");

    resultInput.setSelectionRange(0, resultInput.value.length);
    fireEvent.keyDown(resultInput, {
      code: "Tab",
      key: "Tab",
      shiftKey: true,
    });

    expect(resultInput).toHaveValue("첫째 줄\n둘째 줄");
  });

  it("Escape 다음 Tab은 가로채지 않고 입력창을 벗어날 수 있게 한다", () => {
    renderEditableResult("학습 결과");

    const resultInput = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "학습 결과",
    });
    const escapeEvent = createEvent.keyDown(resultInput, { key: "Escape" });
    const tabEvent = createEvent.keyDown(resultInput, { key: "Tab" });

    fireEvent(resultInput, escapeEvent);
    fireEvent(resultInput, tabEvent);

    expect(tabEvent.defaultPrevented).toBe(false);
    expect(resultInput).toHaveValue("학습 결과");
    expect(resultInput).toHaveAccessibleDescription(
      "Escape를 누른 뒤 Tab 키를 누르면 입력창을 벗어날 수 있습니다.",
    );
  });

  it("읽기 전용 모드에서 학습 결과와 복사 기능만 제공한다", () => {
    const onCopy = vi.fn();

    renderWithProviders(
      <ProjectStepResultCard content="**저장된 결과**" onCopy={onCopy} />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "학습 결과" }),
    ).toBeInTheDocument();
    expect(screen.getByText("저장된 결과").tagName).toBe("STRONG");
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "복사하기" }));
    expect(onCopy).toHaveBeenCalledOnce();
  });

  it("읽기 전용 내용이 없으면 복사 버튼을 표시하지 않는다", () => {
    renderWithProviders(<ProjectStepResultCard content="" onCopy={vi.fn()} />);

    expect(
      screen.getByText("등록된 학습 결과가 없습니다."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "복사하기" }),
    ).not.toBeInTheDocument();
  });
});
