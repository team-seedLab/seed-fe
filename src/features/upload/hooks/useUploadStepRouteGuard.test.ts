import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadStepRouteGuard } from "./useUploadStepRouteGuard";

const { useUploadStepProjectMock, useUploadStepResumeRedirectMock } =
  vi.hoisted(() => ({
    useUploadStepProjectMock: vi.fn(),
    useUploadStepResumeRedirectMock: vi.fn(),
  }));

vi.mock("./useUploadStepProject", () => ({
  useUploadStepProject: useUploadStepProjectMock,
}));

vi.mock("./useUploadStepResumeRedirect", () => ({
  useUploadStepResumeRedirect: useUploadStepResumeRedirectMock,
}));

describe("useUploadStepRouteGuard", () => {
  beforeEach(() => {
    useUploadStepProjectMock.mockReset();
    useUploadStepResumeRedirectMock.mockReset();

    useUploadStepProjectMock.mockReturnValue({
      progressStep: 2,
      project: {
        projectId: "project-1",
        status: "IN_PROGRESS",
      },
      selectableStepCodes: ["constraint_analysis", "argument_structuring"],
      stepCode: "argument_structuring",
      steps: [
        "constraint_analysis",
        "argument_structuring",
        "draft_generation",
        "report_revision",
      ],
    });
    useUploadStepResumeRedirectMock.mockReturnValue({ isResolved: true });
  });

  it("프로젝트 ID나 단계 번호가 유효하지 않으면 업로드 페이지로 이동한다", () => {
    const { result } = renderHook(() =>
      useUploadStepRouteGuard({
        projectId: undefined,
        shouldResume: false,
        stepNum: 0,
      }),
    );

    expect(result.current).toEqual({
      isReady: true,
      redirectTo: "/upload",
    });
    expect(useUploadStepResumeRedirectMock).toHaveBeenCalledWith({
      enabled: false,
      projectId: "",
      stepNum: 0,
    });
  });

  it("프로젝트의 단계 수를 초과하면 업로드 페이지로 이동한다", () => {
    const { result } = renderHook(() =>
      useUploadStepRouteGuard({
        projectId: "project-1",
        shouldResume: false,
        stepNum: 5,
      }),
    );

    expect(result.current.redirectTo).toBe("/upload");
  });

  it("완료된 프로젝트는 상세 페이지로 이동하고 이어하기를 실행하지 않는다", () => {
    useUploadStepProjectMock.mockReturnValue({
      progressStep: 4,
      project: {
        projectId: "project-1",
        status: "COMPLETED",
      },
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

    const { result } = renderHook(() =>
      useUploadStepRouteGuard({
        projectId: "project-1",
        shouldResume: true,
        stepNum: 2,
      }),
    );

    expect(result.current.redirectTo).toBe("/project/project-1");
    expect(useUploadStepResumeRedirectMock).toHaveBeenCalledWith({
      enabled: false,
      projectId: "project-1",
      stepNum: 2,
    });
  });

  it("아직 진행할 수 없는 단계는 현재 진행 단계로 이동한다", () => {
    useUploadStepProjectMock.mockReturnValue({
      progressStep: 2,
      project: {
        projectId: "project-1",
        status: "IN_PROGRESS",
      },
      selectableStepCodes: ["constraint_analysis", "argument_structuring"],
      stepCode: "report_revision",
      steps: [
        "constraint_analysis",
        "argument_structuring",
        "draft_generation",
        "report_revision",
      ],
    });

    const { result } = renderHook(() =>
      useUploadStepRouteGuard({
        projectId: "project-1",
        shouldResume: false,
        stepNum: 4,
      }),
    );

    expect(result.current.redirectTo).toBe("/upload/step/project-1/2");
  });

  it("이어하기 경로를 계산하는 동안 화면 준비를 대기한다", () => {
    useUploadStepResumeRedirectMock.mockReturnValue({ isResolved: false });

    const { result } = renderHook(() =>
      useUploadStepRouteGuard({
        projectId: "project-1",
        shouldResume: true,
        stepNum: 1,
      }),
    );

    expect(result.current).toEqual({
      isReady: false,
      redirectTo: null,
    });
  });

  it("접근 가능한 단계는 화면을 표시할 수 있는 상태를 반환한다", () => {
    const { result } = renderHook(() =>
      useUploadStepRouteGuard({
        projectId: "project-1",
        shouldResume: false,
        stepNum: 2,
      }),
    );

    expect(result.current).toEqual({
      isReady: true,
      redirectTo: null,
    });
  });
});
