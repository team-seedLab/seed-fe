import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadStepProject } from "./useUploadStepProject";

const useGetProjectDetailMock = vi.fn();

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useGetProjectDetail: () => useGetProjectDetailMock(),
  };
});

describe("useUploadStepProject", () => {
  beforeEach(() => {
    useGetProjectDetailMock.mockReset();
    useGetProjectDetailMock.mockReturnValue({
      data: {
        createdAt: "2026-07-12T00:00:00",
        projectId: "project-1",
        roadmapType: "REPORT",
        status: "IN_PROGRESS",
        stepResponses: [
          {
            stepCode: "constraint_analysis",
            userSubmittedResult: "완료된 결과",
          },
          {
            stepCode: "argument_structuring",
            userSubmittedResult: null,
          },
          {
            stepCode: "draft_generation",
            userSubmittedResult: null,
          },
        ],
        title: "테스트 프로젝트",
      },
    });
  });

  it("제출 결과가 있는 단계와 현재 단계를 선택 가능 단계에 포함한다", () => {
    const { result } = renderHook(() =>
      useUploadStepProject({ projectId: "project-1", stepNum: 2 }),
    );

    expect(result.current.completedStepCodes).toEqual(["constraint_analysis"]);
    expect(result.current.selectableStepCodes).toEqual([
      "constraint_analysis",
      "argument_structuring",
    ]);
  });
});
