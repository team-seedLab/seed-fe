import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { USER_ROLE, type UserRole, useUserInfoStore } from "@/entities";
import { ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import { HomeLogoLink } from "./HomeLogoLink";

vi.mock("/logo.webp", () => ({ default: "/logo.webp" }));

type RenderHomeLogoLinkOptions = {
  isAuthenticated: boolean;
  role?: UserRole;
};

const renderHomeLogoLink = ({
  isAuthenticated,
  role,
}: RenderHomeLogoLinkOptions) => {
  useUserInfoStore.setState({
    userInfo: null,
    persistedProfile: role
      ? {
          nickname: "user",
          profileUrl: "",
          role,
        }
      : null,
  });

  return renderWithProviders(<HomeLogoLink height={8} />, {
    authValue: { isAuthenticated },
  });
};

describe("HomeLogoLink", () => {
  it("비로그인 사용자는 메인 페이지로 이동한다", () => {
    renderHomeLogoLink({ isAuthenticated: false });

    expect(screen.getByRole("link", { name: "SEED" })).toHaveAttribute(
      "href",
      ROUTE_PATHS.ROOT,
    );
  });

  it("멘티는 마이페이지로 이동한다", () => {
    renderHomeLogoLink({
      isAuthenticated: true,
      role: USER_ROLE.MENTEE,
    });

    expect(screen.getByRole("link", { name: "SEED" })).toHaveAttribute(
      "href",
      ROUTE_PATHS.MYPAGE,
    );
  });

  it("멘토는 멘토 대시보드로 이동한다", () => {
    renderHomeLogoLink({
      isAuthenticated: true,
      role: USER_ROLE.MENTOR,
    });

    expect(screen.getByRole("link", { name: "SEED" })).toHaveAttribute(
      "href",
      ROUTE_PATHS.MENTOR_DASHBOARD,
    );
  });
});
