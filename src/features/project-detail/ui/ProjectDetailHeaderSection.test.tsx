import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { ProjectDetailHeaderSection } from "./ProjectDetailHeaderSection";

const PROJECT = {
  projectId: "project-1",
  title: "테스트 프로젝트",
  roadmapType: "REPORT" as const,
  status: "COMPLETED" as const,
  createdAt: "2026-07-14T10:00:00",
  completedAt: "2026-07-15T10:00:00",
};

describe("ProjectDetailHeaderSection", () => {
  it("전달받은 헤더 액션을 프로젝트 제목과 함께 표시한다", () => {
    renderWithProviders(
      <ProjectDetailHeaderSection
        action={<button type="button">검토 완료</button>}
        project={PROJECT}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "테스트 프로젝트" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "검토 완료" }),
    ).toBeInTheDocument();
  });
});
