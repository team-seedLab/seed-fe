import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadFlowStore } from "@/entities";
import { ROUTE_PATHS, toaster } from "@/shared";
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

  afterEach(() => {
    vi.restoreAllMocks();
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

  it("PDF 파일은 최대 두 개까지만 추가한다", () => {
    const createToastSpy = vi
      .spyOn(toaster, "create")
      .mockReturnValue("file-count-warning");

    renderWithProviders(<UploadPage />);

    fireEvent.change(screen.getByLabelText("참고자료 파일 선택"), {
      target: {
        files: [
          new File(["first pdf"], "first.pdf", {
            type: "application/pdf",
          }),
          new File(["second pdf"], "second.pdf", {
            type: "application/pdf",
          }),
          new File(["third pdf"], "third.pdf", {
            type: "application/pdf",
          }),
        ],
      },
    });

    expect(screen.getByText(/PDF 파일을 최대 2개까지/)).toBeInTheDocument();
    expect(screen.getByText("first.pdf")).toBeInTheDocument();
    expect(screen.getByText("second.pdf")).toBeInTheDocument();
    expect(screen.queryByText("third.pdf")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "참고자료 추가" }),
    ).not.toBeInTheDocument();
    expect(createToastSpy).toHaveBeenCalledWith({
      type: "warning",
      description:
        "최대 2개까지만 업로드할 수 있어 일부 파일은 제외되었습니다.",
    });
  });

  it("입력한 사용자 의도를 프로젝트 생성 API에 전달한다", async () => {
    let resolveRequestFormData!: (formData: FormData) => void;
    const requestFormDataPromise = new Promise<FormData>((resolve) => {
      resolveRequestFormData = resolve;
    });

    server.use(
      http.post("*/api/projects", async ({ request }) => {
        resolveRequestFormData(await request.formData());

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
    });
    const requestFormData = await requestFormDataPromise;

    expect(requestFormData.get("title")).toBe("AI 활용 분석");
    expect(requestFormData.get("desiredOutcome")).toBe("A4 3장 분량의 보고서");
    expect(requestFormData.get("keyFocus")).toBe("사용자 경험 중심");
    expect(requestFormData.get("requiredElements")).toBe("비교 표와 참고문헌");
  });
});
