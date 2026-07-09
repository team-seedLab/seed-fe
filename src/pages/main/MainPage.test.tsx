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

  it("濡쒓렇???곹깭硫???λ맂 ??븷 湲곗? 吏꾩엯 寃쎈줈濡??대룞?쒕떎", () => {
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

  it("濡쒓렇???곹깭硫?硫섑넗 ??븷 湲곗? 吏꾩엯 寃쎈줈濡??대룞?쒕떎", () => {
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

  it("鍮꾨줈洹몄씤 ?곹깭硫?濡쒓렇??寃쎈줈濡??대룞?쒕떎", () => {
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
