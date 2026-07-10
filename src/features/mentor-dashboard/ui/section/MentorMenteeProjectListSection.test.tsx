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
    startedAt: "2026-07-01T09:00:00",
    submittedAt: "2026-07-08T14:20:00",
    currentStep: 2,
    totalSteps: 4,
    completionRate: 50,
  },
  {
    projectId: "mentor-project-2",
    title: "Project Beta",
    status: "COMPLETED",
    startedAt: "2026-06-27T09:30:00",
    submittedAt: "2026-07-06T17:10:00",
    currentStep: 4,
    totalSteps: 4,
    completionRate: 100,
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

    fireEvent.click(screen.getByText(/Project Alpha/i));

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
        startedAt: "2026-07-01T09:00:00",
        submittedAt: "2026-07-01T09:00:00",
        currentStep: 1,
        totalSteps: 4,
        completionRate: 25,
      },
      {
        projectId: "project-2",
        title: "Project 2",
        status: "IN_PROGRESS",
        startedAt: "2026-07-02T09:00:00",
        submittedAt: "2026-07-02T09:00:00",
        currentStep: 2,
        totalSteps: 4,
        completionRate: 50,
      },
      {
        projectId: "project-3",
        title: "Project 3",
        status: "IN_PROGRESS",
        startedAt: "2026-07-03T09:00:00",
        submittedAt: "2026-07-03T09:00:00",
        currentStep: 3,
        totalSteps: 4,
        completionRate: 75,
      },
      {
        projectId: "project-4",
        title: "Project 4",
        status: "COMPLETED",
        startedAt: "2026-07-04T09:00:00",
        submittedAt: "2026-07-04T09:00:00",
        currentStep: 4,
        totalSteps: 4,
        completionRate: 100,
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
