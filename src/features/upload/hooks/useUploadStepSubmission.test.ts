import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadStepSubmission } from "./useUploadStepSubmission";

const {
  completeProjectAPIMock,
  invalidateQueriesMock,
  navigateMock,
  saveProjectStepResultAPIMock,
  saveProjectStepSelfCheckAPIMock,
  setQueryDataMock,
} = vi.hoisted(() => ({
  completeProjectAPIMock: vi.fn(),
  invalidateQueriesMock: vi.fn(),
  navigateMock: vi.fn(),
  saveProjectStepResultAPIMock: vi.fn(),
  saveProjectStepSelfCheckAPIMock: vi.fn(),
  setQueryDataMock: vi.fn(),
}));

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    completeProjectAPI: completeProjectAPIMock,
    saveProjectStepResultAPI: saveProjectStepResultAPIMock,
    saveProjectStepSelfCheckAPI: saveProjectStepSelfCheckAPIMock,
  };
});

const SELF_CHECK_ANSWERS = [
  {
    key: "core_understanding",
    answer: "핵심 내용을 충분히 작성한 답변입니다.",
  },
  {
    key: "result_application",
    answer: "적용 내용을 충분히 작성한 답변입니다.",
  },
  {
    key: "uncertainty_review",
    answer: "확인 내용을 충분히 작성한 답변입니다.",
  },
];

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: invalidateQueriesMock,
      setQueryData: setQueryDataMock,
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
    saveProjectStepResultAPIMock.mockReset();
    saveProjectStepSelfCheckAPIMock.mockReset();
    setQueryDataMock.mockReset();

    completeProjectAPIMock.mockResolvedValue(undefined);
    invalidateQueriesMock.mockResolvedValue(undefined);
    saveProjectStepResultAPIMock.mockResolvedValue({
      contentMarkdown: "단계 결과",
      stepCode: "constraint_analysis",
    });
    saveProjectStepSelfCheckAPIMock.mockResolvedValue({
      checkItems: SELF_CHECK_ANSWERS,
      selfCheckId: "self-check-1",
      stepCode: "constraint_analysis",
    });
  });

  it("단계 결과와 Self-Check 저장 후 다음 단계로 이동한다", async () => {
    const { result } = renderHook(() =>
      useUploadStepSubmission({
        isLastStep: false,
        projectId: "project-1",
        stepCode: "constraint_analysis",
        stepNum: 1,
      }),
    );

    await act(async () => {
      await result.current.submitStep({
        checkItems: SELF_CHECK_ANSWERS,
        resultText: "단계 결과",
      });
    });

    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      exact: true,
      queryKey: ["project", "detail", "project-1"],
    });
    expect(saveProjectStepResultAPIMock).toHaveBeenCalledWith({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      contentMarkdown: "단계 결과",
    });
    expect(setQueryDataMock).toHaveBeenCalledWith(
      [
        "project",
        "detail",
        "project-1",
        "step",
        "constraint_analysis",
        "result",
      ],
      expect.objectContaining({ contentMarkdown: "단계 결과" }),
    );
    expect(saveProjectStepSelfCheckAPIMock).toHaveBeenCalledWith({
      projectId: "project-1",
      stepCode: "constraint_analysis",
      checkItems: SELF_CHECK_ANSWERS,
    });
    expect(
      saveProjectStepResultAPIMock.mock.invocationCallOrder[0],
    ).toBeLessThan(saveProjectStepSelfCheckAPIMock.mock.invocationCallOrder[0]);
    expect(
      saveProjectStepSelfCheckAPIMock.mock.invocationCallOrder[0],
    ).toBeLessThan(invalidateQueriesMock.mock.invocationCallOrder[0]);
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
      await result.current.submitStep({
        checkItems: SELF_CHECK_ANSWERS,
        resultText: "마지막 단계 결과",
      });
    });

    expect(
      saveProjectStepResultAPIMock.mock.invocationCallOrder[0],
    ).toBeLessThan(saveProjectStepSelfCheckAPIMock.mock.invocationCallOrder[0]);
    expect(
      saveProjectStepSelfCheckAPIMock.mock.invocationCallOrder[0],
    ).toBeLessThan(completeProjectAPIMock.mock.invocationCallOrder[0]);
    expect(completeProjectAPIMock.mock.invocationCallOrder[0]).toBeLessThan(
      invalidateQueriesMock.mock.invocationCallOrder[0],
    );
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      exact: true,
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
    expect(navigateMock).toHaveBeenCalledWith("/project/project-1");
  });

  it("마지막 단계 결과 저장 후 프로젝트 완료에 실패해도 상세 캐시를 갱신한다", async () => {
    completeProjectAPIMock.mockRejectedValueOnce(new Error("완료 실패"));

    const { result } = renderHook(() =>
      useUploadStepSubmission({
        isLastStep: true,
        projectId: "project-1",
        stepCode: "report_revision",
        stepNum: 4,
      }),
    );

    await act(async () => {
      await result.current.submitStep({
        checkItems: SELF_CHECK_ANSWERS,
        resultText: "마지막 단계 결과",
      });
    });

    expect(saveProjectStepResultAPIMock).toHaveBeenCalled();
    expect(invalidateQueriesMock).toHaveBeenCalledWith({
      exact: true,
      queryKey: ["project", "detail", "project-1"],
    });
    expect(invalidateQueriesMock).not.toHaveBeenCalledWith({
      queryKey: ["project", "list"],
      refetchType: "all",
    });
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("Self-Check 저장에 실패하면 단계 이동과 프로젝트 완료를 하지 않는다", async () => {
    saveProjectStepSelfCheckAPIMock.mockRejectedValueOnce(
      new Error("Self-Check 저장 실패"),
    );
    const { result } = renderHook(() =>
      useUploadStepSubmission({
        isLastStep: false,
        projectId: "project-1",
        stepCode: "constraint_analysis",
        stepNum: 1,
      }),
    );

    await act(async () => {
      await result.current.submitStep({
        checkItems: SELF_CHECK_ANSWERS,
        resultText: "단계 결과",
      });
    });

    expect(saveProjectStepResultAPIMock).toHaveBeenCalled();
    expect(saveProjectStepSelfCheckAPIMock).toHaveBeenCalled();
    expect(completeProjectAPIMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("저장 중 다른 단계로 이동하면 기존 요청이 화면 이동을 덮어쓰지 않는다", async () => {
    let resolveSave!: () => void;
    saveProjectStepResultAPIMock.mockImplementation(
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
      submissionPromise = result.current.submitStep({
        checkItems: SELF_CHECK_ANSWERS,
        resultText: "1단계 결과",
      });
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
    saveProjectStepResultAPIMock.mockImplementation(
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
      submissionPromise = result.current.submitStep({
        checkItems: SELF_CHECK_ANSWERS,
        resultText: "1단계 결과",
      });
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
