import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { MentorProjectDetailResponse } from "@/entities";
import { renderWithProviders } from "@/test/test-utils";

import { MentorProjectDetailSection } from "./MentorProjectDetailSection";

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
      selfCheck: {
        checkItems: [
          {
            key: "core-learning",
            question: "이번 단계에서 이해한 핵심 내용은 무엇인가요?",
            answer: "자료의 신뢰성과 과제의 제약사항을 함께 확인해야 합니다.",
          },
          {
            key: "remaining-question",
            question: "추가로 확인해야 할 내용은 무엇인가요?",
            answer: null,
          },
        ],
        submittedAt: "2026-07-09T10:00:00",
      },
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
  it("멘토가 검토할 프로젝트 정보와 첫 번째 단계 기록을 표시한다", () => {
    renderWithProviders(<MentorProjectDetailSection project={PROJECT} />);

    const aiDependencyHeading = screen.getByRole("heading", {
      level: 2,
      name: "AI 의존도 분석",
    });
    const initialIntentHeading = screen.getByRole("heading", {
      level: 2,
      name: "초기 의도",
    });

    expect(aiDependencyHeading).toBeInTheDocument();
    expect(initialIntentHeading).toBeInTheDocument();
    expect(
      aiDependencyHeading.compareDocumentPosition(initialIntentHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByText("A4 3장 분량의 보고서")).toBeInTheDocument();
    expect(screen.getByText("78")).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "AI 의존도" }),
    ).toHaveAttribute("aria-valuenow", "35");
    expect(screen.getByText("수정 프롬프트")).toBeInTheDocument();
    const resultHeading = screen.getByRole("heading", {
      level: 3,
      name: "1단계 학습 결과",
    });
    const selfCheckHeading = screen.getByRole("heading", {
      level: 2,
      name: "이해 확인 및 검증",
    });

    expect(resultHeading).toBeInTheDocument();
    expect(
      screen.getByText("이번 단계에서 이해한 핵심 내용은 무엇인가요?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "자료의 신뢰성과 과제의 제약사항을 함께 확인해야 합니다.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("작성된 답변이 없습니다.")).toBeInTheDocument();
    expect(
      resultHeading.compareDocumentPosition(selfCheckHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: "단계별 기록" }),
    ).not.toBeInTheDocument();
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
      screen.getByText("제출된 Self-Check가 없습니다."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "목차별 단락 초안 분할 생성",
      }),
    ).not.toBeInTheDocument();
  });
});
