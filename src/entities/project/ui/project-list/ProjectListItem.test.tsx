import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { ProjectListItem } from "./ProjectListItem";

const renderProjectListItem = (
  overrides: Partial<Parameters<typeof ProjectListItem>[0]> = {},
) => {
  const onClick = vi.fn();
  const onDelete = vi.fn();

  renderWithProviders(
    <ProjectListItem
      name="환경학 개론 과제"
      updatedAt="2026-07-12T11:00:00"
      currentStepOrder={2}
      totalStepCount={4}
      progressPercent={25}
      onClick={onClick}
      onDelete={onDelete}
      {...overrides}
    />,
  );

  return { onClick, onDelete };
};

describe("ProjectListItem", () => {
  it("현재 단계와 완료 단계 기준 진행률을 표시한다", () => {
    renderProjectListItem();

    expect(screen.getByText("Step 2 of 4")).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "25",
    );
  });

  it("단계가 없는 프로젝트는 0단계와 0%로 표시한다", () => {
    renderProjectListItem({
      currentStepOrder: null,
      totalStepCount: 0,
      progressPercent: 0,
    });

    expect(screen.getByText("Step 0 of 0")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });

  it("프로젝트 열기 버튼을 제공한다", () => {
    renderProjectListItem();

    expect(
      screen.getByRole("button", {
        name: "환경학 개론 과제 프로젝트 열기",
      }),
    ).toHaveAttribute("type", "button");
  });

  it("프로젝트 카드를 선택하면 전달된 선택 함수를 실행한다", () => {
    const { onClick } = renderProjectListItem();

    fireEvent.click(
      screen.getByRole("button", {
        name: "환경학 개론 과제 프로젝트 열기",
      }),
    );

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("더보기 메뉴에서 삭제해도 프로젝트 선택 함수는 실행하지 않는다", async () => {
    const { onClick, onDelete } = renderProjectListItem();

    fireEvent.click(screen.getByRole("button", { name: "프로젝트 더보기" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: "삭제" }));

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });
});
