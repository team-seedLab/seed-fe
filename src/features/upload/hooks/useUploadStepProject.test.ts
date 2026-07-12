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

  it("완료 단계로 돌아가도 첫 미완료 단계를 선택 가능 상태로 유지한다", () => {
    const { result } = renderHook(() =>
      useUploadStepProject({ projectId: "project-1", stepNum: 1 }),
    );

    expect(result.current.completedStepCodes).toEqual(["constraint_analysis"]);
    expect(result.current.selectableStepCodes).toEqual([
      "constraint_analysis",
      "argument_structuring",
    ]);
  });

  it("여러 단계를 완료한 뒤 과거 단계를 보고 있어도 진행 가능 단계를 유지한다", () => {
    useGetProjectDetailMock.mockReturnValue({
      data: {
        createdAt: "2026-07-12T00:00:00",
        projectId: "project-1",
        roadmapType: "REPORT",
        status: "IN_PROGRESS",
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
          {
            stepCode: "report_revision",
            userSubmittedResult: null,
          },
        ],
        title: "테스트 프로젝트",
      },
    });

    const { result } = renderHook(() =>
      useUploadStepProject({ projectId: "project-1", stepNum: 2 }),
    );

    expect(result.current.selectableStepCodes).toEqual([
      "constraint_analysis",
      "argument_structuring",
      "draft_generation",
      "report_revision",
    ]);
  });
});
