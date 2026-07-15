import { waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/test-utils";

import { useGetMentorStudentList } from "./useGetMentorStudentList";

const EMPTY_MENTOR_STUDENT_LIST = {
  summary: {
    totalStudentCount: 0,
    reviewingCount: 0,
    reviewedCount: 0,
  },
  students: [],
};

describe("useGetMentorStudentList", () => {
  it("대시보드에 다시 진입하면 학생 목록을 재조회한다", async () => {
    let requestCount = 0;
    server.use(
      http.get("*/api/mentor/students", () => {
        requestCount += 1;

        return HttpResponse.json(
          createApiSuccessResponse(EMPTY_MENTOR_STUDENT_LIST),
        );
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
      () => useGetMentorStudentList(),
      { queryClient },
    );

    await waitFor(() => {
      expect(firstRender.result.current.isSuccess).toBe(true);
    });
    firstRender.unmount();

    const secondRender = renderHookWithProviders(
      () => useGetMentorStudentList(),
      { queryClient },
    );

    await waitFor(() => {
      expect(requestCount).toBe(2);
    });
    secondRender.unmount();
  });
});
