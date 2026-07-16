import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadStepHeaderSection } from "./UploadStepHeaderSection";

const goToStepMock = vi.fn();

vi.mock("../../hooks", async () => {
  const actual =
    await vi.importActual<typeof import("../../hooks")>("../../hooks");

  return {
    ...actual,
    useUploadStepNavigation: () => ({
      goToStep: goToStepMock,
    }),
    useUploadStepProject: () => ({
      completedStepCodes: ["constraint_analysis"],
      project: {
        roadmapType: "REPORT",
        title: "테스트 프로젝트",
      },
      selectableStepCodes: ["constraint_analysis", "argument_structuring"],
      steps: [
        "constraint_analysis",
        "argument_structuring",
        "draft_generation",
      ],
    }),
  };
});

describe("UploadStepHeaderSection", () => {
  beforeEach(() => {
    goToStepMock.mockReset();
  });

  it("완료된 단계를 선택하면 해당 단계로 이동한다", () => {
    renderWithProviders(
      <UploadStepHeaderSection projectId="project-1" stepNum={2} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "제약사항 분석 및 주제 구체화" }),
    );

    expect(goToStepMock).toHaveBeenCalledWith(1);
    expect(
      screen.queryByRole("button", { name: "목차별 단락 초안 분할 생성" }),
    ).not.toBeInTheDocument();
  });
});
