import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useUserInfoStore } from "@/entities";
import { renderWithProviders } from "@/test/test-utils";

import MentorDashboardPage from "./MentorDashboardPage";

describe("MentorDashboardPage", () => {
  beforeEach(() => {
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
        role: "MENTOR",
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
});
