import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadStepSelfCheck } from "./useUploadStepSelfCheck";

const { refetchMock, useGetProjectStepSelfCheckMock } = vi.hoisted(() => ({
  refetchMock: vi.fn(),
  useGetProjectStepSelfCheckMock: vi.fn(),
}));

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useGetProjectStepSelfCheck: useGetProjectStepSelfCheckMock,
  };
});

const CHECK_ITEMS = [
  {
    key: "core_understanding",
    question: "핵심 내용을 설명해 주세요.",
    answer: "기존에 저장되어 있던 충분히 긴 첫 번째 답변입니다.",
  },
  {
    key: "result_application",
    question: "결과물에 어떻게 적용했나요?",
    answer: "기존에 저장되어 있던 충분히 긴 두 번째 답변입니다.",
  },
  {
    key: "uncertainty_review",
    question: "다시 확인할 부분은 무엇인가요?",
    answer: "기존에 저장되어 있던 충분히 긴 세 번째 답변입니다.",
  },
];

describe("useUploadStepSelfCheck", () => {
  beforeEach(() => {
    refetchMock.mockReset();
    useGetProjectStepSelfCheckMock.mockReset();
    useGetProjectStepSelfCheckMock.mockReturnValue({
      data: { checkItems: CHECK_ITEMS },
      isError: false,
      isLoading: false,
      refetch: refetchMock,
    });
  });

  it("모달이 열렸을 때만 현재 단계의 Self-Check를 조회한다", () => {
    const { result } = renderHook(() =>
      useUploadStepSelfCheck({
        projectId: "project-1",
        stepCode: "constraint_analysis",
      }),
    );

    expect(useGetProjectStepSelfCheckMock).toHaveBeenLastCalledWith(
      "project-1",
      "constraint_analysis",
      false,
    );

    act(() => result.current.openSelfCheck());

    expect(useGetProjectStepSelfCheckMock).toHaveBeenLastCalledWith(
      "project-1",
      "constraint_analysis",
      true,
    );
  });

  it("기존 답변을 유지하면서 수정한 답변으로 저장 요청값을 만든다", () => {
    const { result } = renderHook(() =>
      useUploadStepSelfCheck({
        projectId: "project-1",
        stepCode: "constraint_analysis",
      }),
    );

    act(() => {
      result.current.changeAnswer(
        "core_understanding",
        "수정한 핵심 내용도 공백 제외 열 글자 이상입니다.",
      );
    });

    expect(result.current.answers[0]).toEqual({
      key: "core_understanding",
      answer: "수정한 핵심 내용도 공백 제외 열 글자 이상입니다.",
    });
    expect(result.current.answers[1]?.answer).toBe(CHECK_ITEMS[1].answer);
    expect(result.current.isValid).toBe(true);
  });

  it("수정하지 않은 답변은 새로 조회된 서버 값을 반영한다", () => {
    const { rerender, result } = renderHook(() =>
      useUploadStepSelfCheck({
        projectId: "project-1",
        stepCode: "constraint_analysis",
      }),
    );

    act(() => {
      result.current.changeAnswer(
        "core_understanding",
        "사용자가 직접 수정한 핵심 내용입니다.",
      );
    });

    const updatedAnswer = "서버에서 새로 조회한 두 번째 답변입니다.";
    useGetProjectStepSelfCheckMock.mockReturnValue({
      data: {
        checkItems: CHECK_ITEMS.map((item) =>
          item.key === "result_application"
            ? { ...item, answer: updatedAnswer }
            : item,
        ),
      },
      isError: false,
      isLoading: false,
      refetch: refetchMock,
    });

    rerender();

    expect(result.current.answers[0]?.answer).toBe(
      "사용자가 직접 수정한 핵심 내용입니다.",
    );
    expect(result.current.answers[1]?.answer).toBe(updatedAnswer);
  });

  it("답변이 공백 제외 열 글자보다 짧으면 유효하지 않다", () => {
    const { result } = renderHook(() =>
      useUploadStepSelfCheck({
        projectId: "project-1",
        stepCode: "constraint_analysis",
      }),
    );

    act(() => {
      result.current.changeAnswer("core_understanding", "짧은 답변");
    });

    expect(result.current.isValid).toBe(false);
  });
});
