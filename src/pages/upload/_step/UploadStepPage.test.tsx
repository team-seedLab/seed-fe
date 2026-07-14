import { Route, Routes } from "react-router";

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import UploadStepPage from "./UploadStepPage";

const { useUploadStepRouteGuardMock } = vi.hoisted(() => ({
  useUploadStepRouteGuardMock: vi.fn(),
}));

vi.mock("@/features", async () => {
  const actual =
    await vi.importActual<typeof import("@/features")>("@/features");

  return {
    ...actual,
    UploadStepWorkspaceSection: ({ stepNum }: { stepNum: number }) => (
      <div>
        <span>단계 헤더</span>
        <span>단계 콘텐츠</span>
        <span>{`현재 단계 ${stepNum}`}</span>
      </div>
    ),
    useUploadStepRouteGuard: useUploadStepRouteGuardMock,
  };
});

describe("UploadStepPage", () => {
  beforeEach(() => {
    useUploadStepRouteGuardMock.mockReset();
    useUploadStepRouteGuardMock.mockReturnValue({
      isReady: true,
      redirectTo: null,
    });
  });

  it("가드가 반환한 경로로 이동한다", () => {
    useUploadStepRouteGuardMock.mockReturnValue({
      isReady: true,
      redirectTo: "/project/project-1",
    });

    renderWithProviders(
      <Routes>
        <Route
          element={<UploadStepPage />}
          path="/upload/step/:projectId/:step"
        />
        <Route
          element={<div>프로젝트 상세 페이지</div>}
          path="/project/:projectId"
        />
      </Routes>,
      { initialEntries: ["/upload/step/project-1/2?resume=true"] },
    );

    expect(screen.getByText("프로젝트 상세 페이지")).toBeInTheDocument();
    expect(screen.queryByText("단계 콘텐츠")).not.toBeInTheDocument();
  });

  it("가드가 준비되지 않았으면 단계 화면을 표시하지 않는다", () => {
    useUploadStepRouteGuardMock.mockReturnValue({
      isReady: false,
      redirectTo: null,
    });

    renderWithProviders(
      <Routes>
        <Route
          element={<UploadStepPage />}
          path="/upload/step/:projectId/:step"
        />
      </Routes>,
      { initialEntries: ["/upload/step/project-1/2"] },
    );

    expect(screen.queryByText("단계 헤더")).not.toBeInTheDocument();
    expect(screen.queryByText("단계 콘텐츠")).not.toBeInTheDocument();
    expect(useUploadStepRouteGuardMock).toHaveBeenCalledWith({
      projectId: "project-1",
      shouldResume: false,
      stepNum: 2,
    });
  });

  it("가드가 준비되면 현재 단계 화면을 표시한다", () => {
    renderWithProviders(
      <Routes>
        <Route
          element={<UploadStepPage />}
          path="/upload/step/:projectId/:step"
        />
      </Routes>,
      { initialEntries: ["/upload/step/project-1/2"] },
    );

    expect(screen.getByText("단계 헤더")).toBeInTheDocument();
    expect(screen.getByText("현재 단계 2")).toBeInTheDocument();
    expect(useUploadStepRouteGuardMock).toHaveBeenCalledWith({
      projectId: "project-1",
      shouldResume: false,
      stepNum: 2,
    });
  });
});
