import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUserInfoStore } from "@/entities";
import { DYNAMIC_ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import MentorDashboardPage from "./MentorDashboardPage";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("MentorDashboardPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    useUserInfoStore.setState({
      userInfo: null,
      persistedProfile: null,
    });
  });

  it("멘토 대시보드와 학생 목록을 표시한다", () => {
    useUserInfoStore.setState({
      userInfo: null,
      persistedProfile: {
        nickname: "서연",
        profileUrl: "",
        role: "MENTOR",
      },
    });

    renderWithProviders(<MentorDashboardPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    expect(screen.getByText("반갑습니다, 서연님")).toBeInTheDocument();
    expect(screen.getByText("학생 목록")).toBeInTheDocument();
    expect(screen.getByText("김서연")).toBeInTheDocument();
    expect(screen.getAllByText("2026.07.08")).toHaveLength(2);
  });

  it("학생 카드를 클릭하면 멘티 프로젝트 목록 페이지로 이동한다", () => {
    useUserInfoStore.setState({
      userInfo: null,
      persistedProfile: {
        nickname: "서연",
        profileUrl: "",
        role: "MENTOR",
      },
    });

    renderWithProviders(<MentorDashboardPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /김서연/,
      }),
    );

    expect(navigateMock).toHaveBeenCalledWith(
      DYNAMIC_ROUTE_PATHS.MENTOR_MENTEE_PROJECTS("mentee-1"),
    );
  });
});
