import { waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/test-utils";

import { useGetMentorStudentProjectList } from "./useGetMentorStudentProjectList";

const EMPTY_PROJECT_LIST = {
  studentId: "mentee-1",
  nickname: "김멘티",
  email: "mentee@seed.test",
  profileUrl: null,
  projects: [],
};

describe("useGetMentorStudentProjectList", () => {
  it("프로젝트 목록 페이지에 다시 진입하면 목록을 재조회한다", async () => {
    let requestCount = 0;
    server.use(
      http.get("*/api/mentor/students/mentee-1/projects", () => {
        requestCount += 1;
        return HttpResponse.json(createApiSuccessResponse(EMPTY_PROJECT_LIST));
      }),
    );
    const queryClient = createTestQueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          staleTime: Number.POSITIVE_INFINITY,
        },
      },
    });

    const firstRender = renderHookWithProviders(
      () => useGetMentorStudentProjectList("mentee-1"),
      { queryClient },
    );

    await waitFor(() => {
      expect(firstRender.result.current.isSuccess).toBe(true);
    });
    firstRender.unmount();

    const secondRender = renderHookWithProviders(
      () => useGetMentorStudentProjectList("mentee-1"),
      { queryClient },
    );

    await waitFor(() => {
      expect(requestCount).toBe(2);
    });
    secondRender.unmount();
  });

  it("멘티 ID가 없으면 목록을 조회하지 않는다", () => {
    let requestCount = 0;
    server.use(
      http.get("*/api/mentor/students/:studentId/projects", () => {
        requestCount += 1;
        return HttpResponse.json(createApiSuccessResponse(EMPTY_PROJECT_LIST));
      }),
    );

    const { result } = renderHookWithProviders(() =>
      useGetMentorStudentProjectList(""),
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(requestCount).toBe(0);
  });
});
