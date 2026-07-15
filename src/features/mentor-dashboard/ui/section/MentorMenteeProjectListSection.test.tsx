import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DYNAMIC_ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import type { MentorMenteeProject } from "../../types";

import { MentorMenteeProjectListSection } from "./MentorMenteeProjectListSection";

const navigateMock = vi.fn();

const menteeId = "mentee-1";
const sampleProjects: MentorMenteeProject[] = [
  {
    projectId: "mentor-project-1",
    title: "Project Alpha",
    status: "IN_PROGRESS",
    currentStepOrder: 2,
    totalStepCount: 4,
    progressPercent: 50,
    updatedAt: "2026-07-08T14:20:00",
  },
  {
    projectId: "mentor-project-2",
    title: "Project Beta",
    status: "COMPLETED",
    currentStepOrder: 4,
    totalStepCount: 4,
    progressPercent: 100,
    updatedAt: "2026-07-06T17:10:00",
  },
];

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("MentorMenteeProjectListSection", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("renders the project list", () => {
    renderWithProviders(
      <MentorMenteeProjectListSection
        menteeId={menteeId}
        projects={sampleProjects}
      />,
    );

    expect(screen.getByText(/Project Alpha/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Beta/i)).toBeInTheDocument();
  });

  it("shows only completed projects when completed filter is selected", () => {
    renderWithProviders(
      <MentorMenteeProjectListSection
        menteeId={menteeId}
        projects={sampleProjects}
      />,
    );

    const completedFilterButton = screen.getAllByRole("button")[2];
    fireEvent.click(completedFilterButton);

    expect(screen.queryByText(/Project Alpha/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Project Beta/i)).toBeInTheDocument();
  });

  it("navigates to the project detail page when a project is selected", () => {
    renderWithProviders(
      <MentorMenteeProjectListSection
        menteeId={menteeId}
        projects={sampleProjects}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Project Alpha 프로젝트 열기" }),
    );

    expect(navigateMock).toHaveBeenCalledWith(
      DYNAMIC_ROUTE_PATHS.PROJECT_DETAIL("mentor-project-1"),
      {
        state: {
          backTo: DYNAMIC_ROUTE_PATHS.MENTOR_MENTEE_PROJECTS(menteeId),
        },
      },
    );
  });

  it("keeps showing data when current page becomes larger than total pages", () => {
    const paginatedProjects: MentorMenteeProject[] = [
      {
        projectId: "project-1",
        title: "Project 1",
        status: "IN_PROGRESS",
        currentStepOrder: 1,
        totalStepCount: 4,
        progressPercent: 25,
        updatedAt: "2026-07-01T09:00:00",
      },
      {
        projectId: "project-2",
        title: "Project 2",
        status: "IN_PROGRESS",
        currentStepOrder: 2,
        totalStepCount: 4,
        progressPercent: 50,
        updatedAt: "2026-07-02T09:00:00",
      },
      {
        projectId: "project-3",
        title: "Project 3",
        status: "IN_PROGRESS",
        currentStepOrder: 3,
        totalStepCount: 4,
        progressPercent: 75,
        updatedAt: "2026-07-03T09:00:00",
      },
      {
        projectId: "project-4",
        title: "Project 4",
        status: "COMPLETED",
        currentStepOrder: 4,
        totalStepCount: 4,
        progressPercent: 100,
        updatedAt: "2026-07-04T09:00:00",
      },
    ];

    const { rerender } = renderWithProviders(
      <MentorMenteeProjectListSection
        menteeId={menteeId}
        projects={paginatedProjects}
      />,
    );

    fireEvent.click(screen.getByLabelText("Page 2"));
    expect(screen.getByText(/Project 4/i)).toBeInTheDocument();

    rerender(
      <MentorMenteeProjectListSection
        menteeId={menteeId}
        projects={[paginatedProjects[0]]}
      />,
    );

    expect(screen.getByText(/Project 1/i)).toBeInTheDocument();
  });
});
