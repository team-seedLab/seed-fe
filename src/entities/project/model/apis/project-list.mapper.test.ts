import { describe, expect, it } from "vitest";

import { mapProjectListResponse } from "./project-list.mapper";

describe("mapProjectListResponse", () => {
  it("백엔드 프로젝트 상태와 진행 정보를 목록 데이터로 변환한다", () => {
    const response = mapProjectListResponse({
      content: [
        {
          projectId: "project-1",
          title: "환경학 개론 과제",
          roadmapType: "REPORT",
          projectStatus: "COMPLETED",
          currentRoadmapStep: "REPORT_REVISION",
          currentStepOrder: 4,
          totalStepCount: 4,
          completedStepCount: 4,
          progressPercent: 100,
          createdAt: "2026-07-01T10:00:00",
          updatedAt: "2026-07-12T11:00:00",
          completedAt: "2026-07-12T11:00:00",
        },
      ],
      currentPage: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1,
      hasNext: false,
    });

    expect(response.content[0]).toEqual({
      projectId: "project-1",
      title: "환경학 개론 과제",
      roadmapType: "REPORT",
      status: "COMPLETED",
      currentStepOrder: 4,
      totalStepCount: 4,
      completedStepCount: 4,
      progressPercent: 100,
      createdAt: "2026-07-01T10:00:00",
      updatedAt: "2026-07-12T11:00:00",
      completedAt: "2026-07-12T11:00:00",
    });
  });
});
