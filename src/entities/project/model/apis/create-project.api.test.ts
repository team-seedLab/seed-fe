import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";

import {
  type CreateProjectRequest,
  createProjectAPI,
} from "./create-project.api";

describe("createProjectAPI", () => {
  it("변경된 사용자 의도와 PDF를 multipart form data로 전송한다", async () => {
    let requestFormData: FormData | null = null;

    server.use(
      http.post("*/api/projects", async ({ request }) => {
        requestFormData = await request.formData();

        return HttpResponse.json(
          createApiSuccessResponse({
            projectId: "project-1",
            title: "테스트 프로젝트",
            roadmapType: "REPORT",
            status: "IN_PROGRESS",
            createdAt: "2026-07-13T10:00:00",
          }),
        );
      }),
    );

    const file = new File(["pdf content"], "assignment.pdf", {
      type: "application/pdf",
    });
    const request: CreateProjectRequest = {
      title: "테스트 프로젝트",
      roadmapType: "REPORT",
      desiredOutcome: "A4 3장 분량의 리포트",
      keyFocus: "사용자 경험을 중심으로 분석",
      requiredElements: "비교 표와 참고문헌 포함",
      files: [file],
    };

    const response = await createProjectAPI(request);

    expect(response.projectId).toBe("project-1");
    expect(requestFormData?.get("title")).toBe(request.title);
    expect(requestFormData?.get("roadmapType")).toBe(request.roadmapType);
    expect(requestFormData?.get("desiredOutcome")).toBe(request.desiredOutcome);
    expect(requestFormData?.get("keyFocus")).toBe(request.keyFocus);
    expect(requestFormData?.get("requiredElements")).toBe(
      request.requiredElements,
    );
    expect(requestFormData?.getAll("files")).toHaveLength(1);
    expect(requestFormData?.has("userIntent")).toBe(false);
  });
});
