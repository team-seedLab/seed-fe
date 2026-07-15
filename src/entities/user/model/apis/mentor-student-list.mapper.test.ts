import { describe, expect, it } from "vitest";

import { mapMentorStudentListResponse } from "./mentor-student-list.mapper";

describe("mapMentorStudentListResponse", () => {
  it("멘토 대시보드 요약과 멘티 목록을 화면 모델로 변환한다", () => {
    const response = mapMentorStudentListResponse({
      summary: {
        totalStudentCount: 2,
        reviewingCount: 1,
        reviewedCount: 0,
      },
      students: [
        {
          studentId: "mentee-1",
          nickname: "김멘티",
          email: "mentee@seed.test",
          profileUrl: null,
          totalProjectCount: 2,
          inProgressProjectCount: 1,
          completedProjectCount: 1,
          reviewStatus: "REVIEWING",
          lastProjectUpdatedAt: "2026-07-15T10:00:00",
        },
        {
          studentId: "mentee-2",
          nickname: "프로젝트 없음",
          email: "empty@seed.test",
          profileUrl: null,
          totalProjectCount: 0,
          inProgressProjectCount: 0,
          completedProjectCount: 0,
          reviewStatus: null,
          lastProjectUpdatedAt: null,
        },
      ],
    });

    expect(response).toEqual({
      summary: {
        studentCount: 2,
        reviewingCount: 1,
        reviewedCount: 0,
      },
      mentees: [
        {
          menteeId: "mentee-1",
          name: "김멘티",
          projectCount: 2,
          latestUpdatedAt: "2026-07-15T10:00:00",
          reviewStatus: "REVIEWING",
        },
        {
          menteeId: "mentee-2",
          name: "프로젝트 없음",
          projectCount: 0,
          latestUpdatedAt: null,
          reviewStatus: "NOT_APPLICABLE",
        },
      ],
    });
  });
});
