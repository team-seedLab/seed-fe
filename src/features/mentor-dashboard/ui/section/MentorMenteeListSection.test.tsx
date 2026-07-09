import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DYNAMIC_ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import {
  SAMPLE_MENTEE_ID,
  SAMPLE_MENTOR_DASHBOARD_MENTEES,
} from "../../test/mentor-dashboard.samples";

import { MentorMenteeListSection } from "./MentorMenteeListSection";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("MentorMenteeListSection", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("멘티 목록을 표시한다", () => {
    renderWithProviders(
      <MentorMenteeListSection mentees={SAMPLE_MENTOR_DASHBOARD_MENTEES} />,
    );

    expect(screen.getByText("학생 목록")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /김서연/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /최연주/ })).toBeInTheDocument();
  });

  it("멘티를 선택하면 프로젝트 목록 경로로 이동한다", () => {
    renderWithProviders(
      <MentorMenteeListSection mentees={SAMPLE_MENTOR_DASHBOARD_MENTEES} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /김서연/ }));

    expect(navigateMock).toHaveBeenCalledWith(
      DYNAMIC_ROUTE_PATHS.MENTOR_MENTEE_PROJECTS(SAMPLE_MENTEE_ID),
    );
  });
});
