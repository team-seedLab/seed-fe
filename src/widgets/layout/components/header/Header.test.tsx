import { useLocation } from "react-router";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { USER_ROLE, type UserRole, useUserInfoStore } from "@/entities";
import { ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import { Header } from "./Header";

vi.mock("/logo.webp", () => ({ default: "/logo.webp" }));

const CurrentPath = () => {
  const { pathname } = useLocation();

  return <output aria-label="현재 경로">{pathname}</output>;
};

const renderHeader = (role: UserRole) => {
  useUserInfoStore.setState({
    userInfo: {
      userId: "user-1",
      nickname: "테스트 사용자",
      profileUrl: null,
      role,
    },
    persistedProfile: null,
  });

  return renderWithProviders(
    <>
      <Header />
      <CurrentPath />
    </>,
    {
      authValue: { isAuthenticated: true },
    },
  );
};

const openProfileMenu = () => {
  fireEvent.click(screen.getByText("테스트 사용자"));
};

describe("Header", () => {
  it("학생에게 내 프로젝트 메뉴를 제공한다", async () => {
    renderHeader(USER_ROLE.MENTEE);

    openProfileMenu();

    const projectMenu = await screen.findByRole("menuitem", {
      name: "내 프로젝트",
    });

    fireEvent.click(projectMenu);

    expect(screen.getByRole("status", { name: "현재 경로" })).toHaveTextContent(
      ROUTE_PATHS.MYPAGE,
    );
  });

  it("멘토에게 학생 리스트 메뉴를 제공한다", async () => {
    renderHeader(USER_ROLE.MENTOR);

    openProfileMenu();

    const studentListMenu = await screen.findByRole("menuitem", {
      name: "학생 리스트",
    });

    fireEvent.click(studentListMenu);

    expect(screen.getByRole("status", { name: "현재 경로" })).toHaveTextContent(
      ROUTE_PATHS.MENTOR_DASHBOARD,
    );
  });
});
