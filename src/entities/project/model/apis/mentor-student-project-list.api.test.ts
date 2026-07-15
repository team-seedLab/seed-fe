import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";

import { getMentorStudentProjectListAPI } from "./mentor-student-project-list.api";

describe("mentor student project list API", () => {
  it("선택한 멘티의 프로젝트 목록 경로로 조회한다", async () => {
    server.use(
      http.get("*/api/mentor/students/:studentId/projects", ({ params }) => {
        return HttpResponse.json(
          createApiSuccessResponse({
            studentId: params.studentId as string,
            nickname: "김멘티",
            email: "mentee@seed.test",
            profileUrl: null,
            projects: [],
          }),
        );
      }),
    );

    const response = await getMentorStudentProjectListAPI("mentee-1");

    expect(response).toEqual({
      menteeId: "mentee-1",
      menteeName: "김멘티",
      projects: [],
    });
  });
});
