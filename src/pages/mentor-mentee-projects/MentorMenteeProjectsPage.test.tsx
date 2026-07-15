import { Route, Routes } from "react-router";

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DYNAMIC_ROUTE_PATHS, ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import MentorMenteeProjectsPage from "./MentorMenteeProjectsPage";

const useGetMentorStudentProjectListMock = vi.fn();

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useGetMentorStudentProjectList: (...args: unknown[]) =>
      useGetMentorStudentProjectListMock(...args),
  };
});

const renderPage = () => {
  return renderWithProviders(
    <Routes>
      <Route
        element={<MentorMenteeProjectsPage />}
        path={ROUTE_PATHS.MENTOR_MENTEE_PROJECTS}
      />
    </Routes>,
    {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
      initialEntries: [DYNAMIC_ROUTE_PATHS.MENTOR_MENTEE_PROJECTS("mentee-1")],
    },
  );
};

describe("MentorMenteeProjectsPage", () => {
  beforeEach(() => {
    useGetMentorStudentProjectListMock.mockReset();
    useGetMentorStudentProjectListMock.mockReturnValue({
      data: {
        menteeId: "mentee-1",
        menteeName: "김멘티",
        projects: [],
      },
      isError: false,
      isLoading: false,
    });
  });

  it("API 응답의 멘티 정보와 프로젝트 목록을 표시한다", () => {
    useGetMentorStudentProjectListMock.mockReturnValue({
      data: {
        menteeId: "mentee-1",
        menteeName: "김멘티",
        projects: [
          {
            projectId: "project-1",
            title: "환경학 개론 과제",
            status: "COMPLETED",
            currentStepOrder: 4,
            totalStepCount: 4,
            progressPercent: 100,
            updatedAt: "2026-07-15T10:00:00",
          },
          {
            projectId: "project-2",
            title: "심리학 개론 과제",
            status: "IN_PROGRESS",
            currentStepOrder: 2,
            totalStepCount: 4,
            progressPercent: 25,
            updatedAt: "2026-07-16T10:00:00",
          },
        ],
      },
      isError: false,
      isLoading: false,
    });

    renderPage();

    expect(screen.getByText("김멘티")).toBeInTheDocument();
    expect(screen.getByText("환경학 개론 과제")).toBeInTheDocument();
    const totalSummaryLabels = screen
      .getAllByText("전체")
      .filter((label) => !label.closest("button"));
    const completedSummaryLabels = screen
      .getAllByText("완료")
      .filter((label) => !label.closest("button"));

    expect(totalSummaryLabels).toHaveLength(2);
    expect(completedSummaryLabels).toHaveLength(2);
    totalSummaryLabels.forEach((label) => {
      expect(label.parentElement).toHaveTextContent("2");
    });
    completedSummaryLabels.forEach((label) => {
      expect(label.parentElement).toHaveTextContent("1");
    });
    expect(useGetMentorStudentProjectListMock).toHaveBeenCalledWith("mentee-1");
  });

  it("프로젝트 목록이 비어 있으면 빈 상태를 표시한다", () => {
    renderPage();

    expect(screen.getByText("김멘티")).toBeInTheDocument();
    expect(
      screen.getByText("프로젝트 목록이 준비되면 여기에 표시됩니다."),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("이전 페이지")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("다음 페이지")).not.toBeInTheDocument();
  });

  it("프로젝트 목록을 불러오는 동안 로딩 상태를 표시한다", () => {
    useGetMentorStudentProjectListMock.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
    });

    renderPage();

    expect(
      screen.getByLabelText("멘티 프로젝트 목록 불러오는 중"),
    ).toBeInTheDocument();
  });

  it("프로젝트 목록 조회에 실패하면 오류 상태를 표시한다", () => {
    useGetMentorStudentProjectListMock.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
    });

    renderPage();

    expect(
      screen.getByText("멘티 프로젝트 목록을 불러오지 못했습니다."),
    ).toBeInTheDocument();
  });
});
