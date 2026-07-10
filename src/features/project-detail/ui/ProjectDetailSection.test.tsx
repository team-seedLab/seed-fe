import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { ProjectDetailResponse, ProjectStepResponse } from "@/entities";
import { renderWithProviders } from "@/test/test-utils";

import { ProjectDetailSection } from "./ProjectDetailSection";

const ORIGINAL_PROMPT = "첫 번째 줄\n분량: 제한 없음\n마지막 줄";
const EDITED_PROMPT = "첫 번째 줄\n분량: A4 2장\n마지막 줄";

const createProject = (
  userEditedPrompt?: string | null,
): ProjectDetailResponse => {
  const step: ProjectStepResponse = {
    formatPrompt: "",
    providedPromptSnapshot: ORIGINAL_PROMPT,
    stepCode: "RESEARCH",
    stepName: "자료 조사",
    userEditedPrompt,
    userSubmittedResult: "작업 결과",
  };

  return {
    createdAt: "2026-07-10",
    projectId: "project-1",
    roadmapType: "REPORT",
    status: "COMPLETED",
    stepResponses: [step],
    title: "테스트 프로젝트",
  };
};

describe("ProjectDetailSection", () => {
  it("수정본이 없으면 기존 생성 프롬프트를 읽기 전용으로 표시한다", () => {
    renderWithProviders(<ProjectDetailSection project={createProject()} />);

    expect(screen.getByText("생성된 프롬프트")).toBeInTheDocument();
    expect(screen.queryByText("최종 프롬프트")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("수정본이 있으면 원본과 최종본을 읽기 전용으로 표시한다", () => {
    renderWithProviders(
      <ProjectDetailSection project={createProject(EDITED_PROMPT)} />,
    );

    expect(screen.getByText("원본 프롬프트")).toBeInTheDocument();
    expect(screen.getByText("최종 프롬프트")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "초기화" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "차이보기" }));
    expect(screen.getByText("- 분량: 제한 없음")).toBeInTheDocument();
    expect(screen.getByText("+ 분량: A4 2장")).toBeInTheDocument();
  });
});
