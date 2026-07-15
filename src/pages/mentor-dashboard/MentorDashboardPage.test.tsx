import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { USER_ROLE, useUserInfoStore } from "@/entities";
import { renderWithProviders } from "@/test/test-utils";

import MentorDashboardPage from "./MentorDashboardPage";

const useGetMentorStudentListMock = vi.fn();

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useGetMentorStudentList: () => useGetMentorStudentListMock(),
  };
});

describe("MentorDashboardPage", () => {
  beforeEach(() => {
    useGetMentorStudentListMock.mockReset();
    useGetMentorStudentListMock.mockReturnValue({
      data: {
        summary: {
          studentCount: 0,
          reviewingCount: 0,
          reviewedCount: 0,
        },
        mentees: [],
      },
      isError: false,
      isLoading: false,
    });
    useUserInfoStore.setState({
      userInfo: null,
      persistedProfile: null,
    });
  });

  it("멘토 대시보드 기본 구조와 빈 상태를 표시한다", () => {
    useUserInfoStore.setState({
      userInfo: null,
      persistedProfile: {
        nickname: "서연",
        profileUrl: "",
        role: USER_ROLE.MENTOR,
      },
    });

    renderWithProviders(<MentorDashboardPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    expect(screen.getByText("반가워요, 서연님")).toBeInTheDocument();
    expect(screen.getByText("학생 목록")).toBeInTheDocument();
    expect(
      screen.getByText("멘티 목록이 준비되면 여기에 표시됩니다."),
    ).toBeInTheDocument();
  });

  it("API 응답의 요약과 멘티 목록을 표시한다", () => {
    useGetMentorStudentListMock.mockReturnValue({
      data: {
        summary: {
          studentCount: 1,
          reviewingCount: 1,
          reviewedCount: 0,
        },
        mentees: [
          {
            menteeId: "mentee-1",
            name: "김멘티",
            projectCount: 2,
            latestUpdatedAt: "2026-07-15T10:00:00",
            reviewStatus: "REVIEWING",
          },
        ],
      },
      isError: false,
      isLoading: false,
    });

    renderWithProviders(<MentorDashboardPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    expect(screen.getByText("김멘티")).toBeInTheDocument();
    expect(screen.getAllByText("2026.07.15")).not.toHaveLength(0);
    expect(screen.getAllByText("X")).not.toHaveLength(0);
  });

  it("멘티 목록을 불러오는 동안 로딩 상태를 표시한다", () => {
    useGetMentorStudentListMock.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
    });

    renderWithProviders(<MentorDashboardPage />);

    expect(screen.getByLabelText("멘티 목록 불러오는 중")).toBeInTheDocument();
  });

  it("멘티 목록 조회가 실패하면 오류 상태를 표시한다", () => {
    useGetMentorStudentListMock.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
    });

    renderWithProviders(<MentorDashboardPage />);

    expect(
      screen.getByText("멘티 목록을 불러오지 못했습니다."),
    ).toBeInTheDocument();
  });
});
