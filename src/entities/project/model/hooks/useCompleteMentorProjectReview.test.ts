import { act } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/test-utils";

import type { MentorProjectDetailResponse } from "../apis";
import { projectKeys } from "../constants";

import { useCompleteMentorProjectReview } from "./useCompleteMentorProjectReview";

const PROJECT: MentorProjectDetailResponse = {
  projectId: "project-1",
  studentId: "student-1",
  studentNickname: "김멘티",
  title: "테스트 프로젝트",
  roadmapType: "REPORT",
  status: "COMPLETED",
  desiredOutcome: null,
  keyFocus: null,
  requiredElements: null,
  reviewStatus: "REVIEWING",
  reviewedAt: null,
  createdAt: "2026-07-14T10:00:00",
  updatedAt: "2026-07-14T12:00:00",
  completedAt: "2026-07-14T12:00:00",
  steps: [],
};

describe("useCompleteMentorProjectReview", () => {
  it("검토 완료 응답으로 멘토 프로젝트 상세 캐시를 갱신한다", async () => {
    server.use(
      http.patch("*/api/mentor/projects/project-1/review", () => {
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
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(projectKeys.mentorDetail("project-1"), PROJECT);
    const { result } = renderHookWithProviders(
      () => useCompleteMentorProjectReview("project-1"),
      { queryClient },
    );

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(
      queryClient.getQueryData<MentorProjectDetailResponse>(
        projectKeys.mentorDetail("project-1"),
      ),
    ).toMatchObject({
      reviewStatus: "REVIEWED",
      reviewedAt: "2026-07-15T10:00:00",
    });
  });
});
