import { describe, expect, it } from "vitest";

import { mapMentorProjectDetailResponse } from "./mentor-project-detail.mapper";

describe("mapMentorProjectDetailResponse", () => {
  it("멘토 상세 응답의 단계 기록과 최종 프롬프트를 변환한다", () => {
    const response = mapMentorProjectDetailResponse({
      projectId: "project-1",
      studentId: "student-1",
      studentNickname: "김멘티",
      title: "테스트 프로젝트",
      roadmapType: "REPORT",
      projectStatus: "COMPLETED",
      desiredOutcome: "완성된 보고서",
      keyFocus: "핵심 주장",
      requiredElements: "참고 문헌",
      reviewStatus: "REVIEWING",
      reviewedAt: null,
      createdAt: "2026-07-14T10:00:00",
      updatedAt: "2026-07-14T11:00:00",
      completedAt: "2026-07-14T12:00:00",
      steps: [
        {
          stepId: "step-1",
          stepCode: "CONSTRAINT_ANALYSIS",
          stepName: "제약사항 분석",
          stepOrder: 1,
          status: "COMPLETED",
          completedAt: "2026-07-14T10:30:00",
          prompt: {
            providedPromptSnapshot: "원본 프롬프트",
            editedPrompt: "수정 프롬프트",
            addedCount: null,
            removedCount: null,
            diffJson: null,
          },
          result: {
            contentMarkdown: "# 학습 결과",
          },
          selfCheck: {
            checkItems: [
              {
                key: "understood",
                question: "이해했나요?",
                answer: "네",
              },
            ],
            submittedAt: "2026-07-14T10:30:00",
          },
        },
        {
          stepId: "step-2",
          stepCode: "DRAFT_GENERATION",
          stepName: "초안 생성",
          stepOrder: 2,
          status: "PENDING",
          completedAt: null,
          prompt: null,
          result: null,
          selfCheck: null,
        },
      ],
    });

    expect(response).toMatchObject({
      projectId: "project-1",
      studentId: "student-1",
      status: "COMPLETED",
      reviewStatus: "REVIEWING",
      steps: [
        {
          stepCode: "constraint_analysis",
          prompt: {
            finalPrompt: "수정 프롬프트",
            addedCount: 0,
            removedCount: 0,
          },
          result: {
            contentMarkdown: "# 학습 결과",
          },
        },
        {
          stepCode: "draft_generation",
          prompt: null,
          result: null,
        },
      ],
    });
  });

  it("수정 프롬프트가 없으면 원본 프롬프트를 최종본으로 사용한다", () => {
    const response = mapMentorProjectDetailResponse({
      projectId: "project-1",
      studentId: "student-1",
      studentNickname: "김멘티",
      title: "테스트 프로젝트",
      roadmapType: "REPORT",
      projectStatus: "IN_PROGRESS",
      desiredOutcome: null,
      keyFocus: null,
      requiredElements: null,
      reviewStatus: "REVIEWING",
      reviewedAt: null,
      createdAt: "2026-07-14T10:00:00",
      updatedAt: "2026-07-14T11:00:00",
      completedAt: null,
      steps: [
        {
          stepId: "step-1",
          stepCode: "constraint_analysis",
          stepName: "제약사항 분석",
          stepOrder: 1,
          status: "IN_PROGRESS",
          completedAt: null,
          prompt: {
            providedPromptSnapshot: "원본 프롬프트",
            editedPrompt: null,
            addedCount: 0,
            removedCount: 0,
            diffJson: null,
          },
          result: null,
          selfCheck: null,
        },
      ],
    });

    expect(response.steps[0].prompt?.finalPrompt).toBe("원본 프롬프트");
  });

  it("작업 결과 내용이 null이면 빈 문자열로 변환한다", () => {
    const response = mapMentorProjectDetailResponse({
      projectId: "project-1",
      studentId: "student-1",
      studentNickname: "김멘티",
      title: "테스트 프로젝트",
      roadmapType: "REPORT",
      projectStatus: "IN_PROGRESS",
      desiredOutcome: null,
      keyFocus: null,
      requiredElements: null,
      reviewStatus: "REVIEWING",
      reviewedAt: null,
      createdAt: "2026-07-14T10:00:00",
      updatedAt: "2026-07-14T11:00:00",
      completedAt: null,
      steps: [
        {
          stepId: "step-1",
          stepCode: "constraint_analysis",
          stepName: "제약사항 분석",
          stepOrder: 1,
          status: "COMPLETED",
          completedAt: "2026-07-14T10:30:00",
          prompt: null,
          result: {
            contentMarkdown: null,
          },
          selfCheck: null,
        },
      ],
    });

    expect(response.steps[0].result?.contentMarkdown).toBe("");
  });
});
