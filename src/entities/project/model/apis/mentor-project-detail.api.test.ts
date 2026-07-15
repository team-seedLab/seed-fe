import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";

import {
  completeMentorProjectReviewAPI,
  getMentorProjectDetailAPI,
} from "./mentor-project-detail.api";

const MENTOR_PROJECT_DETAIL_RESPONSE = {
  projectId: "project-1",
  studentId: "student-1",
  studentNickname: "김멘티",
  title: "테스트 프로젝트",
  roadmapType: "REPORT" as const,
  projectStatus: "COMPLETED" as const,
  desiredOutcome: "완성된 보고서",
  keyFocus: "핵심 주장",
  requiredElements: "참고 문헌",
  reviewStatus: "REVIEWING" as const,
  reviewedAt: null,
  createdAt: "2026-07-14T10:00:00",
  updatedAt: "2026-07-14T11:00:00",
  completedAt: "2026-07-14T12:00:00",
  steps: [],
};

describe("mentor project detail API", () => {
  it("멘토 전용 프로젝트 상세 경로로 조회한다", async () => {
    server.use(
      http.get("*/api/mentor/projects/project-1", () =>
        HttpResponse.json(
          createApiSuccessResponse(MENTOR_PROJECT_DETAIL_RESPONSE),
        ),
      ),
    );

    const response = await getMentorProjectDetailAPI("project-1");

    expect(response).toMatchObject({
      projectId: "project-1",
      studentNickname: "김멘티",
      reviewStatus: "REVIEWING",
    });
  });

  it("멘토 전용 검토 완료 경로를 PATCH로 요청한다", async () => {
    let requestMethod = "";
    server.use(
      http.patch("*/api/mentor/projects/project-1/review", ({ request }) => {
        requestMethod = request.method;

        return HttpResponse.json(
          createApiSuccessResponse({
            projectReviewId: "review-1",
            projectId: "project-1",
            status: "REVIEWED" as const,
            reviewedAt: "2026-07-15T10:00:00",
            createdAt: "2026-07-15T10:00:00",
            updatedAt: "2026-07-15T10:00:00",
          }),
        );
      }),
    );

    const response = await completeMentorProjectReviewAPI("project-1");

    expect(requestMethod).toBe("PATCH");
    expect(response.status).toBe("REVIEWED");
  });
});
