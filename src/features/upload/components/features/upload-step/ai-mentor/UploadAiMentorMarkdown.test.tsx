import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadAiMentorMarkdown } from "./UploadAiMentorMarkdown";

describe("UploadAiMentorMarkdown", () => {
  it("AI 답변의 GFM 표를 렌더링한다", () => {
    renderWithProviders(
      <UploadAiMentorMarkdown
        content={`| 항목 | 내용 |
| --- | --- |
| 단계 | 제약사항 분석 |`}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "항목" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "제약사항 분석" }),
    ).toBeInTheDocument();
  });
});
