import { Route, Routes } from "react-router";

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import UploadStepPage from "./UploadStepPage";

const { useUploadStepProjectMock, useUploadStepResumeRedirectMock } =
  vi.hoisted(() => ({
    useUploadStepProjectMock: vi.fn(),
    useUploadStepResumeRedirectMock: vi.fn(() => ({ isResolved: true })),
  }));

vi.mock("@/features", async () => {
  const actual =
    await vi.importActual<typeof import("@/features")>("@/features");

  return {
    ...actual,
    UploadStepContentSection: ({ stepNum }: { stepNum: number }) => (
      <div>
        <span>단계 콘텐츠</span>
        <span>{`현재 단계 ${stepNum}`}</span>
      </div>
    ),
    UploadStepHeaderSection: () => <div>단계 헤더</div>,
    useUploadStepProject: useUploadStepProjectMock,
    useUploadStepResumeRedirect: useUploadStepResumeRedirectMock,
  };
});

describe("UploadStepPage", () => {
  beforeEach(() => {
    useUploadStepProjectMock.mockReset();
    useUploadStepResumeRedirectMock.mockClear();
    useUploadStepProjectMock.mockImplementation(
      ({ stepNum }: { stepNum: number }) => {
        const steps = [
          "constraint_analysis",
          "argument_structuring",
          "draft_generation",
          "report_revision",
        ];

        return {
          project: {
            createdAt: "2026-07-12T00:00:00",
            projectId: "project-1",
            roadmapType: "REPORT",
            status: "IN_PROGRESS",
            stepResponses: [],
            title: "테스트 프로젝트",
          },
          progressStep: 2,
          selectableStepCodes: ["constraint_analysis", "argument_structuring"],
          stepCode: steps[stepNum - 1],
          steps,
        };
      },
    );
  });

  it("프로젝트의 실제 단계 수를 초과한 URL은 업로드 페이지로 이동한다", () => {
    renderWithProviders(
      <Routes>
        <Route
          element={<UploadStepPage />}
          path="/upload/step/:projectId/:step"
        />
        <Route element={<div>업로드 페이지</div>} path="/upload" />
      </Routes>,
      { initialEntries: ["/upload/step/project-1/5"] },
    );

    expect(screen.getByText("업로드 페이지")).toBeInTheDocument();
    expect(screen.queryByText("단계 콘텐츠")).not.toBeInTheDocument();
  });

  it("아직 진행할 수 없는 미래 단계 URL은 현재 진행 단계로 이동한다", () => {
    renderWithProviders(
      <Routes>
        <Route
          element={<UploadStepPage />}
          path="/upload/step/:projectId/:step"
        />
      </Routes>,
      { initialEntries: ["/upload/step/project-1/4"] },
    );

    expect(screen.getByText("현재 단계 2")).toBeInTheDocument();
    expect(screen.queryByText("현재 단계 4")).not.toBeInTheDocument();
  });

  it("완료된 프로젝트의 업로드 단계 URL은 프로젝트 상세 페이지로 이동한다", () => {
    useUploadStepProjectMock.mockReturnValue({
      project: {
        createdAt: "2026-07-12T00:00:00",
        projectId: "project-1",
        roadmapType: "REPORT",
        status: "COMPLETED",
        stepResponses: [],
        title: "완료 프로젝트",
      },
      progressStep: 4,
      selectableStepCodes: [
        "constraint_analysis",
        "argument_structuring",
        "draft_generation",
        "report_revision",
      ],
      stepCode: "argument_structuring",
      steps: [
        "constraint_analysis",
        "argument_structuring",
        "draft_generation",
        "report_revision",
      ],
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
    expect(useUploadStepResumeRedirectMock).toHaveBeenCalledWith({
      enabled: false,
      projectId: "project-1",
      stepNum: 2,
    });
  });
});
