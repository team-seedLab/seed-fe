import { describe, expect, it } from "vitest";

import { mapProjectDetailResponse } from "./project-detail.mapper";

describe("mapProjectDetailResponse", () => {
  it("백엔드 프로젝트 상세 응답을 프론트 프로젝트와 단계 정보로 변환한다", () => {
    const response = mapProjectDetailResponse({
      projectId: "project-1",
      title: "테스트 프로젝트",
      roadmapType: "REPORT",
      projectStatus: "IN_PROGRESS",
      desiredOutcome: "보고서 완성",
      keyFocus: "핵심 주장",
      requiredElements: "참고 문헌",
      currentRoadmapStep: "ARGUMENT_STRUCTURING",
      currentStepOrder: 2,
      totalStepCount: 4,
      completedStepCount: 1,
      progressPercent: 25,
      createdAt: "2026-07-14T10:00:00",
      updatedAt: "2026-07-14T11:00:00",
      completedAt: null,
      steps: [
        {
          stepId: "step-1",
          roadmapStep: "CONSTRAINT_ANALYSIS",
          stepOrder: 1,
          status: "COMPLETED",
          completedAt: "2026-07-14T10:30:00",
        },
        {
          stepId: "step-2",
          roadmapStep: "ARGUMENT_STRUCTURING",
          stepOrder: 2,
          status: "IN_PROGRESS",
          completedAt: null,
        },
      ],
    });

    expect(response).toEqual({
      projectId: "project-1",
      title: "테스트 프로젝트",
      roadmapType: "REPORT",
      status: "IN_PROGRESS",
      desiredOutcome: "보고서 완성",
      keyFocus: "핵심 주장",
      requiredElements: "참고 문헌",
      currentStepCode: "argument_structuring",
      currentStepOrder: 2,
      totalStepCount: 4,
      completedStepCount: 1,
      progressPercent: 25,
      createdAt: "2026-07-14T10:00:00",
      updatedAt: "2026-07-14T11:00:00",
      completedAt: null,
      steps: [
        {
          stepId: "step-1",
          stepCode: "constraint_analysis",
          stepOrder: 1,
          status: "COMPLETED",
          completedAt: "2026-07-14T10:30:00",
        },
        {
          stepId: "step-2",
          stepCode: "argument_structuring",
          stepOrder: 2,
          status: "IN_PROGRESS",
          completedAt: null,
        },
      ],
    });
  });
});
