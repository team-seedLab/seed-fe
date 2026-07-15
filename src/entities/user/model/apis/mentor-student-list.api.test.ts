import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";

import { getMentorStudentListAPI } from "./mentor-student-list.api";

describe("mentor student list API", () => {
  it("멘토에게 배정된 학생 목록 경로로 조회한다", async () => {
    server.use(
      http.get("*/api/mentor/students", () => {
        return HttpResponse.json(
          createApiSuccessResponse({
            summary: {
              totalStudentCount: 1,
              reviewingCount: 0,
              reviewedCount: 1,
            },
            students: [
              {
                studentId: "mentee-1",
                nickname: "김멘티",
                email: "mentee@seed.test",
                profileUrl: null,
                totalProjectCount: 1,
                inProgressProjectCount: 0,
                completedProjectCount: 1,
                reviewStatus: "REVIEWED" as const,
                lastProjectUpdatedAt: "2026-07-15T10:00:00",
              },
            ],
          }),
        );
      }),
    );

    const response = await getMentorStudentListAPI();

    expect(response).toMatchObject({
      summary: {
        studentCount: 1,
        reviewedCount: 1,
      },
      mentees: [
        {
          menteeId: "mentee-1",
          name: "김멘티",
          reviewStatus: "REVIEWED",
        },
      ],
    });
  });
});
