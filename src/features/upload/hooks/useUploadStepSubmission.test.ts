import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadStepSubmission } from "./useUploadStepSubmission";

const {
  completeProjectAPIMock,
  invalidateQueriesMock,
  navigateMock,
  saveStepResultAPIMock,
} = vi.hoisted(() => ({
  completeProjectAPIMock: vi.fn(),
  invalidateQueriesMock: vi.fn(),
  navigateMock: vi.fn(),
  saveStepResultAPIMock: vi.fn(),
}));

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    completeProjectAPI: completeProjectAPIMock,
    saveStepResultAPI: saveStepResultAPIMock,
  };
});

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: invalidateQueriesMock,
    }),
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

describe("useUploadStepSubmission", () => {
  beforeEach(() => {
    completeProjectAPIMock.mockReset();
    invalidateQueriesMock.mockReset();
    navigateMock.mockReset();
    saveStepResultAPIMock.mockReset();

    completeProjectAPIMock.mockResolvedValue(undefined);
    invalidateQueriesMock.mockResolvedValue(undefined);
    saveStepResultAPIMock.mockResolvedValue(undefined);
  });

  it("단계 결과 저장 후 상세 캐시를 갱신하고 다음 단계로 이동한다", async () => {
    const { result } = renderHook(() =>
      useUploadStepSubmission({
        isLastStep: false,
        projectId: "project-1",
        stepCode: "constraint_analysis",
        stepNum: 1,
      }),
    );

    await act(async () => {
      await result.current.submitStepResult("단계 결과");
    });

    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: ["project", "detail", "project-1"],
    });
    expect(saveStepResultAPIMock.mock.invocationCallOrder[0]).toBeLessThan(
      invalidateQueriesMock.mock.invocationCallOrder[0],
    );
    expect(invalidateQueriesMock.mock.invocationCallOrder[0]).toBeLessThan(
      navigateMock.mock.invocationCallOrder[0],
    );
    expect(navigateMock).toHaveBeenCalledWith("/upload/step/project-1/2");
  });

  it("마지막 단계는 프로젝트 완료 후 프로젝트 캐시 전체를 갱신한다", async () => {
    const { result } = renderHook(() =>
      useUploadStepSubmission({
        isLastStep: true,
        projectId: "project-1",
        stepCode: "report_revision",
        stepNum: 4,
      }),
    );

    await act(async () => {
      await result.current.submitStepResult("마지막 단계 결과");
    });

    expect(saveStepResultAPIMock.mock.invocationCallOrder[0]).toBeLessThan(
      completeProjectAPIMock.mock.invocationCallOrder[0],
    );
    expect(completeProjectAPIMock.mock.invocationCallOrder[0]).toBeLessThan(
      invalidateQueriesMock.mock.invocationCallOrder[0],
    );
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: ["project"],
      refetchType: "all",
    });
    expect(invalidateQueriesMock.mock.invocationCallOrder[0]).toBeLessThan(
      navigateMock.mock.invocationCallOrder[0],
    );
    expect(navigateMock).toHaveBeenCalledWith("/upload/complete/project-1");
  });
});
