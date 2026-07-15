import { describe, expect, it } from "vitest";

import { mapMentorStudentProjectListResponse } from "./mentor-student-project-list.mapper";

describe("mapMentorStudentProjectListResponse", () => {
  it("멘티 정보와 프로젝트 진행 정보를 화면 모델로 변환한다", () => {
    const response = mapMentorStudentProjectListResponse({
      studentId: "mentee-1",
      nickname: "김멘티",
      email: "mentee@seed.test",
      profileUrl: null,
      projects: [
        {
          projectId: "project-1",
          title: "환경학 개론 과제",
          roadmapType: "REPORT",
          projectStatus: "IN_PROGRESS",
          currentRoadmapStep: "CONSTRAINT_ANALYSIS",
          currentStepOrder: 2,
          totalStepCount: 4,
          completedStepCount: 1,
          progressPercent: 25,
          reviewStatus: "REVIEWING",
          createdAt: "2026-07-01T10:00:00",
          updatedAt: "2026-07-15T10:00:00",
          completedAt: null,
        },
        {
          projectId: "project-without-step",
          title: "단계가 없는 프로젝트",
          roadmapType: "REPORT",
          projectStatus: "IN_PROGRESS",
          currentRoadmapStep: null,
          currentStepOrder: null,
          totalStepCount: 0,
          completedStepCount: 0,
          progressPercent: 0,
          reviewStatus: "REVIEWING",
          createdAt: "2026-07-16T10:00:00",
          updatedAt: "2026-07-16T10:00:00",
          completedAt: null,
        },
      ],
    });

    expect(response).toEqual({
      menteeId: "mentee-1",
      menteeName: "김멘티",
      projects: [
        {
          projectId: "project-1",
          title: "환경학 개론 과제",
          status: "IN_PROGRESS",
          currentStepOrder: 2,
          totalStepCount: 4,
          progressPercent: 25,
          updatedAt: "2026-07-15T10:00:00",
        },
        {
          projectId: "project-without-step",
          title: "단계가 없는 프로젝트",
          status: "IN_PROGRESS",
          currentStepOrder: null,
          totalStepCount: 0,
          progressPercent: 0,
          updatedAt: "2026-07-16T10:00:00",
        },
      ],
    });
  });
});
