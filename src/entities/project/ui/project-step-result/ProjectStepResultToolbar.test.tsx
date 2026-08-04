import { useId, useState } from "react";

import { fireEvent, screen, waitFor } from "@testing-library/react";
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
