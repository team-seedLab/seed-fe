import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadFlowStore } from "@/entities";
import { ROUTE_PATHS } from "@/shared";
import { createApiSuccessResponse } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/test-utils";

import UploadPage from "./UploadPage";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("UploadPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    useUploadFlowStore.getState().reset();
  });

  it("프로젝트 제목과 세 가지 사용자 의도 입력란을 표시한다", () => {
    renderWithProviders(<UploadPage />);

    expect(screen.getByLabelText("프로젝트 제목")).toBeInTheDocument();
    expect(screen.getByLabelText("원하는 결과물")).toBeInTheDocument();
    expect(screen.getByLabelText("핵심 관점")).toBeInTheDocument();
    expect(screen.getByLabelText("가장 중요한 요소")).toBeInTheDocument();
  });

  it("제목과 파일 또는 사용자 의도가 입력되어야 생성할 수 있다", () => {
    renderWithProviders(<UploadPage />);

    const submitButton = screen.getByRole("button", {
      name: "로드맵 생성하기",
    });

    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("프로젝트 제목"), {
      target: { value: "AI 활용 분석" },
    });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("원하는 결과물"), {
      target: { value: "A4 3장 분량의 보고서" },
    });
    expect(submitButton).toBeEnabled();
  });

  it("제목과 PDF가 입력되면 사용자 의도 없이 생성할 수 있다", () => {
    renderWithProviders(<UploadPage />);

    fireEvent.change(screen.getByLabelText("프로젝트 제목"), {
      target: { value: "AI 활용 분석" },
    });
    fireEvent.change(screen.getByLabelText("참고자료 파일 선택"), {
      target: {
        files: [
          new File(["pdf content"], "assignment.pdf", {
            type: "application/pdf",
          }),
        ],
      },
    });

    expect(
      screen.getByRole("button", { name: "로드맵 생성하기" }),
    ).toBeEnabled();
  });

  it("입력한 사용자 의도를 프로젝트 생성 API에 전달한다", async () => {
    let requestFormData: FormData | null = null;

    server.use(
      http.post("*/api/projects", async ({ request }) => {
        requestFormData = await request.formData();

        return HttpResponse.json(
          createApiSuccessResponse({
            projectId: "project-1",
            title: "AI 활용 분석",
            roadmapType: "REPORT",
            status: "IN_PROGRESS",
            createdAt: "2026-07-13T10:00:00",
          }),
        );
      }),
    );

    renderWithProviders(<UploadPage />);

    fireEvent.change(screen.getByLabelText("프로젝트 제목"), {
      target: { value: "AI 활용 분석" },
    });
    fireEvent.change(screen.getByLabelText("원하는 결과물"), {
      target: { value: "A4 3장 분량의 보고서" },
    });
    fireEvent.change(screen.getByLabelText("핵심 관점"), {
      target: { value: "사용자 경험 중심" },
    });
    fireEvent.change(screen.getByLabelText("가장 중요한 요소"), {
      target: { value: "비교 표와 참고문헌" },
    });
    fireEvent.click(screen.getByRole("button", { name: "로드맵 생성하기" }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(ROUTE_PATHS.UPLOAD_LOADING);
      expect(requestFormData).not.toBeNull();
    });

    expect(requestFormData?.get("title")).toBe("AI 활용 분석");
    expect(requestFormData?.get("desiredOutcome")).toBe("A4 3장 분량의 보고서");
    expect(requestFormData?.get("keyFocus")).toBe("사용자 경험 중심");
    expect(requestFormData?.get("requiredElements")).toBe("비교 표와 참고문헌");
  });
});
