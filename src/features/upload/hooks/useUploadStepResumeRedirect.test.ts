import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadStepResumeRedirect } from "./useUploadStepResumeRedirect";

const { navigateMock, useGetProjectDetailMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  useGetProjectDetailMock: vi.fn(),
}));

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useGetProjectDetail: () => useGetProjectDetailMock(),
  };
});

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("useUploadStepResumeRedirect", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    useGetProjectDetailMock.mockReset();
  });

  it("완료된 단계 다음의 첫 미완료 단계로 이어서 진행한다", () => {
    useGetProjectDetailMock.mockReturnValue({
      data: {
        roadmapType: "REPORT",
        stepResponses: [
          {
            stepCode: "constraint_analysis",
            userSubmittedResult: "1단계 결과",
          },
        ],
      },
      isLoading: false,
    });

    renderHook(() =>
      useUploadStepResumeRedirect({
        enabled: true,
        projectId: "project-1",
        stepNum: 1,
      }),
    );

    expect(navigateMock).toHaveBeenCalledWith("/upload/step/project-1/2", {
      replace: true,
    });
  });

  it("여러 단계가 완료되어도 로드맵 기준의 첫 미완료 단계로 이동한다", () => {
    useGetProjectDetailMock.mockReturnValue({
      data: {
        roadmapType: "REPORT",
        stepResponses: [
          {
            stepCode: "constraint_analysis",
            userSubmittedResult: "1단계 결과",
          },
          {
            stepCode: "argument_structuring",
            userSubmittedResult: "2단계 결과",
          },
          {
            stepCode: "draft_generation",
            userSubmittedResult: "3단계 결과",
          },
        ],
      },
      isLoading: false,
    });

    renderHook(() =>
      useUploadStepResumeRedirect({
        enabled: true,
        projectId: "project-1",
        stepNum: 1,
      }),
    );

    expect(navigateMock).toHaveBeenCalledWith("/upload/step/project-1/4", {
      replace: true,
    });
  });
});
