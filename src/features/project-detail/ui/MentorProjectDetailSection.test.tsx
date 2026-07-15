import { fireEvent, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MentorProjectDetailResponse } from "@/entities";
import { renderWithProviders } from "@/test/test-utils";

import { MentorProjectDetailSection } from "./MentorProjectDetailSection";

const completeReviewMock = vi.fn();

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useCompleteMentorProjectReview: () => ({
      isPending: false,
      mutate: completeReviewMock,
    }),
  };
});

const PROJECT: MentorProjectDetailResponse = {
  projectId: "project-1",
  studentId: "student-1",
  studentNickname: "김멘티",
  title: "환경학 개론 과제",
  roadmapType: "REPORT",
  status: "COMPLETED",
  desiredOutcome: "A4 3장 분량의 보고서",
  keyFocus: "사용자 경험 중심",
  requiredElements: "비교 표와 참고 문헌",
  reviewStatus: "REVIEWING",
  reviewedAt: null,
  createdAt: "2026-07-08T14:20:00",
  updatedAt: "2026-07-10T14:20:00",
  completedAt: "2026-07-10T14:20:00",
  steps: [
    {
      stepId: "step-1",
      stepCode: "constraint_analysis",
      stepName: "제약사항 분석",
      stepOrder: 1,
      status: "COMPLETED",
      completedAt: "2026-07-09T10:00:00",
      prompt: {
        providedPromptSnapshot: "원본 프롬프트",
        editedPrompt: "수정 프롬프트",
        finalPrompt: "수정 프롬프트",
        addedCount: 1,
        removedCount: 1,
        diffJson: null,
      },
      result: {
        contentMarkdown: "# 1단계 학습 결과",
      },
      selfCheck: null,
    },
    {
      stepId: "step-2",
      stepCode: "argument_structuring",
      stepName: "핵심 논거 구조화",
      stepOrder: 2,
      status: "IN_PROGRESS",
      completedAt: null,
      prompt: null,
      result: null,
      selfCheck: null,
    },
    {
      stepId: "step-3",
      stepCode: "draft_generation",
      stepName: "초안 생성",
      stepOrder: 3,
      status: "PENDING",
      completedAt: null,
      prompt: null,
      result: null,
      selfCheck: null,
    },
  ],
};

describe("MentorProjectDetailSection", () => {
  beforeEach(() => {
    completeReviewMock.mockReset();
  });

  it("초기 의도와 검토 상태, 첫 번째 단계 기록을 표시한다", () => {
    renderWithProviders(<MentorProjectDetailSection project={PROJECT} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "초기 의도" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A4 3장 분량의 보고서")).toBeInTheDocument();
    expect(screen.getByText("검토 중")).toBeInTheDocument();
    expect(screen.getByText("수정 프롬프트")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "1단계 학습 결과" }),
    ).toBeInTheDocument();
  });

  it("진행 중인 단계는 선택하고 Pending 단계는 선택하지 못한다", () => {
    renderWithProviders(<MentorProjectDetailSection project={PROJECT} />);

    fireEvent.click(
      screen.getByRole("button", { name: "핵심 논거 검색 및 구조화" }),
    );

    expect(screen.getByText("등록된 프롬프트가 없습니다.")).toBeInTheDocument();
    expect(
      screen.getByText("등록된 학습 결과가 없습니다."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "목차별 단락 초안 분할 생성",
      }),
    ).not.toBeInTheDocument();
  });

  it("확인창을 거쳐 검토 완료를 요청한다", async () => {
    renderWithProviders(<MentorProjectDetailSection project={PROJECT} />);

    fireEvent.click(screen.getByRole("button", { name: "검토 완료" }));

    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "검토 완료" }));

    expect(completeReviewMock).toHaveBeenCalledOnce();
  });

  it("검토 완료 상태와 검토 날짜를 읽기 전용으로 표시한다", () => {
    renderWithProviders(
      <MentorProjectDetailSection
        project={{
          ...PROJECT,
          reviewStatus: "REVIEWED",
          reviewedAt: "2026-07-15T10:00:00",
        }}
      />,
    );

    expect(screen.getByText("검토 완료")).toBeInTheDocument();
    expect(screen.getByText("2026.07.15에 검토했습니다.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "검토 완료" }),
    ).not.toBeInTheDocument();
  });
});
