import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import type { MentorDashboardMentee } from "../types";

import { MentorMenteeListItem } from "./MentorMenteeListItem";

const MENTEE: MentorDashboardMentee = {
  menteeId: "mentee-1",
  name: "김서연",
  profileUrl: "https://example.com/mentee-1.png",
  projectCount: 2,
  latestUpdatedAt: "2026-07-08T14:20:00",
  reviewStatus: "REVIEWING",
};

const renderMenteeListItem = (
  overrides: Partial<MentorDashboardMentee> = {},
) => {
  renderWithProviders(
    <MentorMenteeListItem
      mentee={{ ...MENTEE, ...overrides }}
      onClick={vi.fn()}
    />,
  );
};

describe("MentorMenteeListItem", () => {
  it("학생 프로필 이미지를 표시한다", () => {
    renderMenteeListItem();

    expect(screen.getByAltText("김서연 프로필")).toHaveAttribute(
      "src",
      MENTEE.profileUrl,
    );
  });

  it("프로필 이미지가 없으면 기본 프로필을 표시한다", () => {
    renderMenteeListItem({ profileUrl: null });

    expect(screen.getByLabelText("김서연 기본 프로필")).toHaveAttribute(
      "data-state",
      "visible",
    );
    expect(screen.queryByAltText("김서연 프로필")).not.toBeInTheDocument();
  });

  it("프로필 이미지를 불러오지 못하면 기본 프로필을 표시한다", () => {
    renderMenteeListItem();

    fireEvent.error(screen.getByAltText("김서연 프로필"));

    expect(screen.getByLabelText("김서연 기본 프로필")).toHaveAttribute(
      "data-state",
      "visible",
    );
  });
});
