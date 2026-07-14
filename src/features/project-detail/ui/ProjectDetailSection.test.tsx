import { fireEvent, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import type { ProjectDetailResponse, ProjectStepStatus } from "@/entities";
import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/test-utils";

import { ProjectDetailSection } from "./ProjectDetailSection";

const ORIGINAL_PROMPT = "첫 번째 줄\n분량: 제한 없음\n마지막 줄";
const EDITED_PROMPT = "첫 번째 줄\n분량: A4 2장\n마지막 줄";
const PROMPT_URL = "*/api/projects/project-1/steps/constraint_analysis/prompt";
const RESULT_URL = "*/api/projects/project-1/steps/constraint_analysis/result";

const createProject = (
  stepStatus: ProjectStepStatus = "COMPLETED",
): ProjectDetailResponse => ({
  completedAt: "2026-07-10",
  completedStepCount: stepStatus === "COMPLETED" ? 1 : 0,
  createdAt: "2026-07-10",
  currentStepCode: "constraint_analysis",
  currentStepOrder: 1,
  desiredOutcome: "보고서 완성",
  keyFocus: "핵심 주장",
  projectId: "project-1",
  progressPercent: stepStatus === "COMPLETED" ? 25 : 0,
  requiredElements: "참고 문헌",
  roadmapType: "REPORT",
  status: "IN_PROGRESS",
  steps: [
    {
      completedAt: stepStatus === "COMPLETED" ? "2026-07-10" : null,
      status: stepStatus,
      stepCode: "constraint_analysis",
      stepId: "step-1",
      stepOrder: 1,
    },
  ],
  title: "테스트 프로젝트",
  totalStepCount: 4,
  updatedAt: "2026-07-10",
});

const useStepRecordHandlers = (editedPrompt: string | null) => {
  server.use(
    http.get(PROMPT_URL, () =>
      HttpResponse.json(
        createApiSuccessResponse({
          addedCount: editedPrompt ? 1 : 0,
          createdAt: "2026-07-10",
          diffJson: {},
          editedPrompt,
          finalPrompt: editedPrompt ?? ORIGINAL_PROMPT,
          formatPrompt: "결과 추출 프롬프트",
          providedPromptSnapshot: ORIGINAL_PROMPT,
          removedCount: editedPrompt ? 1 : 0,
          stepCode: "constraint_analysis",
          stepId: "step-1",
          stepName: "제약사항 분석",
          updatedAt: "2026-07-10",
        }),
      ),
    ),
    http.get(RESULT_URL, () =>
      HttpResponse.json(
        createApiSuccessResponse({
          contentMarkdown: "저장된 작업 결과",
          createdAt: "2026-07-10",
          stepCode: "constraint_analysis",
          stepId: "step-1",
          stepName: "제약사항 분석",
          updatedAt: "2026-07-10",
        }),
      ),
    ),
  );
};

describe("ProjectDetailSection", () => {
  it("수정본이 없으면 생성 프롬프트와 작업 결과를 읽기 전용으로 표시한다", async () => {
    useStepRecordHandlers(null);

    renderWithProviders(<ProjectDetailSection project={createProject()} />);

    expect(await screen.findByText("생성된 프롬프트")).toBeInTheDocument();
    expect(screen.getByText("저장된 작업 결과")).toBeInTheDocument();
    expect(screen.queryByText("최종 프롬프트")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("수정본이 있으면 원본과 최종본을 읽기 전용으로 표시한다", async () => {
    useStepRecordHandlers(EDITED_PROMPT);

    renderWithProviders(<ProjectDetailSection project={createProject()} />);

    expect(await screen.findByText("원본 프롬프트")).toBeInTheDocument();
    expect(screen.getByText("최종 프롬프트")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "초기화" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "차이보기" }));
    expect(await screen.findByText("- 분량: 제한 없음")).toBeInTheDocument();
    expect(screen.getByText("+ 분량: A4 2장")).toBeInTheDocument();
  });

  it("시작하지 않은 단계는 상세 기록을 요청하지 않는다", () => {
    renderWithProviders(
      <ProjectDetailSection project={createProject("PENDING")} />,
    );

    expect(screen.queryByText("생성된 프롬프트")).not.toBeInTheDocument();
  });
});
