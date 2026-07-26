import { fireEvent, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { MentorProjectReviewAction } from "./MentorProjectReviewAction";

const completeReviewMock = vi.fn();

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useCompleteMentorProjectReview: () => ({
      isPending: false,
      mutate: completeReviewMock,
    }),
  };
});

describe("MentorProjectReviewAction", () => {
  beforeEach(() => {
    completeReviewMock.mockReset();
  });

  it("확인창을 거쳐 프로젝트 검토 완료를 요청한다", async () => {
    renderWithProviders(
      <MentorProjectReviewAction projectId="project-1" status="REVIEWING" />,
    );

    fireEvent.click(screen.getByRole("button", { name: "검토 완료" }));

    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "검토 완료" }));

    expect(completeReviewMock).toHaveBeenCalledOnce();
  });

  it("검토가 완료된 프로젝트는 완료 상태로 비활성화한다", () => {
    renderWithProviders(
      <MentorProjectReviewAction projectId="project-1" status="REVIEWED" />,
    );

    expect(screen.getByRole("button", { name: "검토 완료됨" })).toBeDisabled();
  });
});
