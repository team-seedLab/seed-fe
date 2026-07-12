import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { ProjectStepIndicator } from "./ProjectStepIndicator";

const STEP_CODES = [
  "constraint_analysis",
  "argument_structuring",
  "draft_generation",
];

describe("ProjectStepIndicator", () => {
  it("전달된 단계 코드의 이름을 모두 표시한다", () => {
    renderWithProviders(
      <ProjectStepIndicator activeStep={1} stepCodes={STEP_CODES} />,
    );

    expect(
      screen.getByText("제약사항 분석 및 주제 구체화"),
    ).toBeInTheDocument();
    expect(screen.getByText("핵심 논거 검색 및 구조화")).toBeInTheDocument();
    expect(screen.getByText("목차별 단락 초안 분할 생성")).toBeInTheDocument();
  });

  it("현재 단계를 접근 가능한 상태로 표시한다", () => {
    const { container } = renderWithProviders(
      <ProjectStepIndicator activeStep={2} stepCodes={STEP_CODES} />,
    );

    expect(container.querySelector('[aria-current="step"]')).toHaveTextContent(
      "2",
    );
  });

  it("선택 함수가 없으면 단계 선택 버튼을 만들지 않는다", () => {
    renderWithProviders(
      <ProjectStepIndicator activeStep={1} stepCodes={STEP_CODES} />,
    );

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("단계를 선택하면 해당 단계 번호를 전달한다", () => {
    const onStepSelect = vi.fn();

    renderWithProviders(
      <ProjectStepIndicator
        activeStep={1}
        completedStepCodes={["constraint_analysis"]}
        stepCodes={STEP_CODES}
        onStepSelect={onStepSelect}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "핵심 논거 검색 및 구조화" }),
    );

    expect(onStepSelect).toHaveBeenCalledWith(2);
  });
});
