import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUserInfoStore } from "@/entities";
import { ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import MainPage from "./MainPage";

const navigateMock = vi.fn();

vi.mock("@/features", () => ({
  AssignmentHelpSection: () => null,
  ExecutionOnlySection: () => null,
}));

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("MainPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("로그인 상태면 멘티 역할 기준 진입 경로로 이동한다", () => {
    useUserInfoStore.setState({
      userInfo: null,
      persistedProfile: {
        nickname: "mentee",
        profileUrl: "",
        role: "MENTEE",
      },
    });

    renderWithProviders(<MainPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    const startButton = screen.getByRole("button", { name: "시작하기" });
    fireEvent.click(startButton);

    expect(navigateMock).toHaveBeenCalledWith(ROUTE_PATHS.MYPAGE);
  });

  it("로그인 상태면 멘토 역할 기준 진입 경로로 이동한다", () => {
    useUserInfoStore.setState({
      userInfo: null,
      persistedProfile: {
        nickname: "mentor",
        profileUrl: "",
        role: "MENTOR",
      },
    });

    renderWithProviders(<MainPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    const startButton = screen.getByRole("button", { name: "시작하기" });
    fireEvent.click(startButton);

    expect(navigateMock).toHaveBeenCalledWith(ROUTE_PATHS.MENTOR_DASHBOARD);
  });

  it("비로그인 상태면 로그인 경로로 이동한다", () => {
    renderWithProviders(<MainPage />, {
      authValue: {
        isAuthenticated: false,
        isLoading: false,
      },
    });

    const startButton = screen.getByRole("button", { name: "시작하기" });
    fireEvent.click(startButton);

    expect(navigateMock).toHaveBeenCalledWith(ROUTE_PATHS.LOGIN);
  });
});
