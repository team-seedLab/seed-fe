import { fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadStepSubmissionControl } from "./UploadStepSubmissionControl";

const { useGetProjectStepSelfCheckMock } = vi.hoisted(() => ({
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

describe("UploadStepSubmissionControl", () => {
  beforeEach(() => {
    useGetProjectStepSelfCheckMock.mockReset();
    useGetProjectStepSelfCheckMock.mockReturnValue({
      data: {
        checkItems: [
          {
            key: "core_understanding",
            question: "핵심 내용을 설명해 주세요.",
            answer: null,
          },
        ],
      },
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it("단계가 변경되면 열려 있던 Self-Check 모달 상태를 초기화한다", async () => {
    const { rerender } = renderWithProviders(
      <UploadStepSubmissionControl
        isLastStep={false}
        isStepLoading={false}
        key="project-1:constraint_analysis"
        projectId="project-1"
        resultText="1단계 작업 결과"
        stepCode="constraint_analysis"
        stepNum={1}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "다음 단계로 진행" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    rerender(
      <UploadStepSubmissionControl
        isLastStep={false}
        isStepLoading={false}
        key="project-1:argument_structuring"
        projectId="project-1"
        resultText=""
        stepCode="argument_structuring"
        stepNum={2}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(useGetProjectStepSelfCheckMock).toHaveBeenLastCalledWith(
      "project-1",
      "argument_structuring",
      false,
    );
  });
});
