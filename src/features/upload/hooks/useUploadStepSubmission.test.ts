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
      queryKey: ["project", "detail", "project-1"],
    });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      queryKey: ["project", "list"],
      refetchType: "all",
    });
    expect(invalidateQueriesMock).toHaveBeenCalledTimes(2);
    expect(invalidateQueriesMock.mock.invocationCallOrder[1]).toBeLessThan(
      navigateMock.mock.invocationCallOrder[0],
    );
    expect(navigateMock).toHaveBeenCalledWith("/upload/complete/project-1");
  });

  it("저장 중 다른 단계로 이동하면 기존 요청이 화면 이동을 덮어쓰지 않는다", async () => {
    let resolveSave!: () => void;
    saveStepResultAPIMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
    );

    const { result, rerender } = renderHook(
      ({ stepNum }) =>
        useUploadStepSubmission({
          isLastStep: false,
          projectId: "project-1",
          stepCode:
            stepNum === 1 ? "constraint_analysis" : "argument_structuring",
          stepNum,
        }),
      { initialProps: { stepNum: 1 } },
    );
    let submissionPromise!: Promise<void>;

    act(() => {
      submissionPromise = result.current.submitStepResult("1단계 결과");
    });
    rerender({ stepNum: 2 });

    await act(async () => {
      resolveSave();
      await submissionPromise;
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("저장 중 다른 단계에 갔다가 돌아와도 이전 요청이 자동 이동하지 않는다", async () => {
    let resolveSave!: () => void;
    saveStepResultAPIMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
    );

    const { result, rerender } = renderHook(
      ({ stepNum }) =>
        useUploadStepSubmission({
          isLastStep: false,
          projectId: "project-1",
          stepCode:
            stepNum === 1 ? "constraint_analysis" : "argument_structuring",
          stepNum,
        }),
      { initialProps: { stepNum: 1 } },
    );
    let submissionPromise!: Promise<void>;

    act(() => {
      submissionPromise = result.current.submitStepResult("1단계 결과");
    });
    rerender({ stepNum: 2 });
    rerender({ stepNum: 1 });

    await act(async () => {
      resolveSave();
      await submissionPromise;
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
