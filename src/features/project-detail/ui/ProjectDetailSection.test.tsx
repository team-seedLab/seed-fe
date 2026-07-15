import { fireEvent, screen } from "@testing-library/react";
import { HttpResponse, delay, http } from "msw";
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

const STEP_NAMES: Record<string, string> = {
  constraint_analysis: "1단계 프롬프트",
  argument_structuring: "2단계 프롬프트",
  draft_generation: "3단계 프롬프트",
};

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
          diffJson: null,
          editedPrompt,
          finalPrompt: editedPrompt ?? ORIGINAL_PROMPT,
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

const createMultiStepProject = (): ProjectDetailResponse => ({
  ...createProject(),
  completedStepCount: 1,
  currentStepCode: "argument_structuring",
  currentStepOrder: 2,
  progressPercent: 33,
  steps: [
    {
      completedAt: null,
      status: "IN_PROGRESS",
      stepCode: "argument_structuring",
      stepId: "step-2",
      stepOrder: 2,
    },
    {
      completedAt: "2026-07-10",
      status: "COMPLETED",
      stepCode: "constraint_analysis",
      stepId: "step-1",
      stepOrder: 1,
    },
    {
      completedAt: null,
      status: "PENDING",
      stepCode: "draft_generation",
      stepId: "step-3",
      stepOrder: 3,
    },
  ],
  totalStepCount: 3,
});

const useMultiStepRecordHandlers = () => {
  server.use(
    http.get(
      "*/api/projects/project-1/steps/:stepCode/prompt",
      ({ params }) => {
        const stepCode = String(params.stepCode);

        return HttpResponse.json(
          createApiSuccessResponse({
            addedCount: 0,
            createdAt: "2026-07-10",
            diffJson: null,
            editedPrompt: null,
            finalPrompt: `${stepCode} 내용`,
            providedPromptSnapshot: `${stepCode} 내용`,
            removedCount: 0,
            stepCode,
            stepId: stepCode,
            stepName: STEP_NAMES[stepCode],
            updatedAt: "2026-07-10",
          }),
        );
      },
    ),
    http.get(
      "*/api/projects/project-1/steps/:stepCode/result",
      ({ params }) => {
        const stepCode = String(params.stepCode);

        return HttpResponse.json(
          createApiSuccessResponse({
            contentMarkdown: `${stepCode} 결과`,
            createdAt: "2026-07-10",
            stepCode,
            stepId: stepCode,
            stepName: STEP_NAMES[stepCode],
            updatedAt: "2026-07-10",
          }),
        );
      },
    ),
  );
};

describe("ProjectDetailSection", () => {
  it("선택한 단계 기록을 불러오는 동안 로딩 상태를 표시한다", () => {
    useStepRecordHandlers(null);
    server.use(
      http.get(PROMPT_URL, async () => {
        await delay(100);

        return HttpResponse.json(
          createApiSuccessResponse({
            addedCount: 0,
            createdAt: "2026-07-10",
            diffJson: null,
            editedPrompt: null,
            finalPrompt: ORIGINAL_PROMPT,
            providedPromptSnapshot: ORIGINAL_PROMPT,
            removedCount: 0,
            stepCode: "constraint_analysis",
            stepId: "step-1",
            stepName: "제약사항 분석",
            updatedAt: "2026-07-10",
          }),
        );
      }),
    );

    renderWithProviders(<ProjectDetailSection project={createProject()} />);

    expect(
      screen.getByText("단계 기록을 불러오는 중입니다."),
    ).toBeInTheDocument();
  });

  it("단계를 순서대로 표시하고 선택한 사용 가능 단계의 기록만 조회한다", async () => {
    useMultiStepRecordHandlers();

    renderWithProviders(
      <ProjectDetailSection project={createMultiStepProject()} />,
    );

    expect(await screen.findByText("1단계 프롬프트")).toBeInTheDocument();
    expect(screen.queryByText("2단계 프롬프트")).not.toBeInTheDocument();
    expect(screen.getByText("목차별 단락 초안 분할 생성")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "목차별 단락 초안 분할 생성" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "핵심 논거 검색 및 구조화" }),
    );

    expect(await screen.findByText("2단계 프롬프트")).toBeInTheDocument();
    expect(screen.queryByText("1단계 프롬프트")).not.toBeInTheDocument();
    expect(screen.queryByText("3단계 프롬프트")).not.toBeInTheDocument();
  });

  it("수정본이 없으면 단계 프롬프트를 단일 비교 카드로 표시한다", async () => {
    useStepRecordHandlers(null);

    renderWithProviders(<ProjectDetailSection project={createProject()} />);

    expect(
      await screen.findByRole("heading", {
        level: 2,
        name: "제약사항 분석 프롬프트",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "왼쪽 프롬프트 복사 → AI에서 실행 → 오른쪽에서 수정 → 결과 기록",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("수정 내용")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "작업 결과" }),
    ).toBeInTheDocument();
    expect(screen.getByText("저장된 작업 결과")).toBeInTheDocument();
    expect(screen.queryByText("생성된 프롬프트")).not.toBeInTheDocument();
    expect(screen.queryByText("원본 프롬프트")).not.toBeInTheDocument();
    expect(screen.queryByText("최종 프롬프트")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "차이보기" })).toBeDisabled();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("수정본이 있으면 단일 카드에서 원본과 수정본의 차이를 표시한다", async () => {
    useStepRecordHandlers(EDITED_PROMPT);

    renderWithProviders(<ProjectDetailSection project={createProject()} />);

    expect(await screen.findByText("수정 내용")).toBeInTheDocument();
    expect(screen.queryByText("원본 프롬프트")).not.toBeInTheDocument();
    expect(screen.queryByText("최종 프롬프트")).not.toBeInTheDocument();
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

    expect(screen.queryByText("수정 내용")).not.toBeInTheDocument();
  });

  it("단계 기록 조회에 실패하면 오류 상태를 표시한다", async () => {
    useStepRecordHandlers(null);
    server.use(
      http.get(PROMPT_URL, () =>
        HttpResponse.json(
          {
            data: null,
            errorCode: "G002",
            errorMessage: "서버 내부 오류가 발생했습니다.",
            serverDataTime: "2026-07-14 10:00:00",
            status: "ERROR",
          },
          { status: 500 },
        ),
      ),
    );

    renderWithProviders(<ProjectDetailSection project={createProject()} />);

    expect(
      await screen.findByText("단계 기록을 불러오지 못했습니다."),
    ).toBeInTheDocument();
  });
});
