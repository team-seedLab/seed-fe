import { useId, useState } from "react";

import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { ProjectStepResultToolbar } from "./ProjectStepResultToolbar";

type HarnessProps = {
  initialContent: string;
};

const ProjectStepResultToolbarTestHarness = ({
  initialContent,
}: HarnessProps) => {
  const textareaId = useId();
  const [content, setContent] = useState(initialContent);

  return (
    <>
      <ProjectStepResultToolbar textareaId={textareaId} />
      <textarea
        aria-label="학습 결과"
        id={textareaId}
        onChange={(event) => setContent(event.target.value)}
        value={content}
      />
    </>
  );
};

describe("ProjectStepResultToolbar", () => {
  it("서식 기능을 텍스트 대신 아이콘 버튼으로 제공한다", () => {
    renderWithProviders(
      <ProjectStepResultToolbarTestHarness initialContent="학습 결과" />,
    );

    const toolbar = screen.getByRole("toolbar", { name: "마크다운 서식" });
    const buttons = within(toolbar).getAllByRole("button");

    expect(buttons).toHaveLength(8);
    buttons.forEach((button) => {
      expect(button.querySelector("svg")).toBeInTheDocument();
      expect(button.textContent).toBe("");
    });
  });

  it("버튼 설명을 선택 도구 내부에 표시한다", async () => {
    renderWithProviders(
      <ProjectStepResultToolbarTestHarness initialContent="학습 결과" />,
    );

    const toolbar = screen.getByRole("toolbar", { name: "마크다운 서식" });
    const headingButton = within(toolbar).getByRole("button", {
      name: "제목",
    });

    fireEvent.pointerOver(headingButton, { pointerType: "mouse" });

    const tooltip = await screen.findByRole("tooltip");

    expect(toolbar).toContainElement(tooltip);
  });

  it.each([
    { buttonName: "제목", expected: "### 내용", value: "내용" },
    { buttonName: "굵게", expected: "**내용**", value: "내용" },
    { buttonName: "기울임", expected: "_내용_", value: "내용" },
    { buttonName: "링크", expected: "[내용](url)", value: "내용" },
    {
      buttonName: "글머리 목록",
      expected: "- 첫째\n- 둘째",
      value: "첫째\n둘째",
    },
    {
      buttonName: "번호 목록",
      expected: "1. 첫째\n2. 둘째",
      value: "첫째\n둘째",
    },
    { buttonName: "인용", expected: "> 내용", value: "내용" },
    { buttonName: "인라인 코드", expected: "`내용`", value: "내용" },
  ])(
    "$buttonName 버튼으로 선택 영역에 마크다운 문법을 적용한다",
    async ({ buttonName, expected, value }) => {
      renderWithProviders(
        <ProjectStepResultToolbarTestHarness initialContent={value} />,
      );

      const textarea = screen.getByRole<HTMLTextAreaElement>("textbox", {
        name: "학습 결과",
      });
      textarea.setSelectionRange(0, value.length);

      fireEvent.click(screen.getByRole("button", { name: buttonName }));

      await waitFor(() => {
        expect(textarea).toHaveValue(expected);
        expect(textarea).toHaveFocus();
      });
    },
  );
});
