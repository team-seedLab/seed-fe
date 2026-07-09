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

  it("멘토 닉네임과 학생 목록을 표시한다", () => {
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
    expect(screen.getByText("김서연")).toBeInTheDocument();
    expect(screen.getAllByText("2026.07.08")).toHaveLength(2);
  });
});
