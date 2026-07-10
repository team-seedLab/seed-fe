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

  it("renders the mentee names", () => {
    renderWithProviders(
      <MentorMenteeListSection mentees={SAMPLE_MENTOR_DASHBOARD_MENTEES} />,
    );

    expect(
      screen.getByText(SAMPLE_MENTOR_DASHBOARD_MENTEES[0].name),
    ).toBeInTheDocument();
    expect(
      screen.getByText(SAMPLE_MENTOR_DASHBOARD_MENTEES[1].name),
    ).toBeInTheDocument();
  });

  it("navigates to the mentee project list when a mentee is selected", () => {
    renderWithProviders(
      <MentorMenteeListSection mentees={SAMPLE_MENTOR_DASHBOARD_MENTEES} />,
    );

    fireEvent.click(screen.getByText(SAMPLE_MENTOR_DASHBOARD_MENTEES[0].name));

    expect(navigateMock).toHaveBeenCalledWith(
      DYNAMIC_ROUTE_PATHS.MENTOR_MENTEE_PROJECTS(SAMPLE_MENTEE_ID),
    );
  });
});
