import { Route, Routes } from "react-router";

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import UploadStepPage from "./UploadStepPage";

const { useUploadStepProjectMock } = vi.hoisted(() => ({
  useUploadStepProjectMock: vi.fn(),
}));

vi.mock("@/features", async () => {
  const actual =
    await vi.importActual<typeof import("@/features")>("@/features");

  return {
    ...actual,
    UploadStepContentSection: () => <div>단계 콘텐츠</div>,
    UploadStepHeaderSection: () => <div>단계 헤더</div>,
    useUploadStepProject: () => useUploadStepProjectMock(),
    useUploadStepResumeRedirect: () => ({ isResolved: true }),
  };
});

describe("UploadStepPage", () => {
  beforeEach(() => {
    useUploadStepProjectMock.mockReset();
    useUploadStepProjectMock.mockReturnValue({
      steps: [
        "constraint_analysis",
        "argument_structuring",
        "draft_generation",
        "report_revision",
      ],
    });
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
});
