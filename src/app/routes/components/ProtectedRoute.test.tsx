import { Route, Routes } from "react-router";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { USER_ROLE, type UserRole, useUserInfoStore } from "@/entities";
import { ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import { ProtectedRoute } from "./ProtectedRoute";

type RenderProtectedRouteOptions = {
  allowedRoles?: readonly UserRole[];
  isAuthenticated?: boolean;
  isLoading?: boolean;
  role?: UserRole;
};

const renderProtectedRoute = ({
  allowedRoles,
  isAuthenticated = true,
  isLoading = false,
  role,
}: RenderProtectedRouteOptions = {}) => {
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

  return renderWithProviders(
    <Routes>
      <Route path={ROUTE_PATHS.LOGIN} element={<div>로그인 페이지</div>} />
      <Route path={ROUTE_PATHS.MYPAGE} element={<div>멘티 기본 페이지</div>} />
      <Route
        path={ROUTE_PATHS.MENTOR_DASHBOARD}
        element={<div>멘토 기본 페이지</div>}
      />
      <Route
        path="/protected"
        element={
          <ProtectedRoute allowedRoles={allowedRoles}>
            <div>보호 페이지</div>
          </ProtectedRoute>
        }
      />
    </Routes>,
    {
      authValue: { isAuthenticated, isLoading },
      initialEntries: ["/protected"],
    },
  );
};

describe("ProtectedRoute", () => {
  it("인증 상태 확인 중에는 페이지를 렌더링하지 않는다", () => {
    renderProtectedRoute({ isLoading: true });

    expect(screen.queryByText("보호 페이지")).not.toBeInTheDocument();
    expect(screen.queryByText("로그인 페이지")).not.toBeInTheDocument();
  });

  it("로그인하지 않은 사용자는 로그인 페이지로 이동한다", () => {
    renderProtectedRoute({ isAuthenticated: false });

    expect(screen.getByText("로그인 페이지")).toBeInTheDocument();
  });

  it("허용 역할을 지정하지 않으면 로그인한 사용자의 접근을 허용한다", () => {
    renderProtectedRoute({ role: USER_ROLE.MENTEE });

    expect(screen.getByText("보호 페이지")).toBeInTheDocument();
  });

  it("허용된 역할의 접근을 허용한다", () => {
    renderProtectedRoute({
      allowedRoles: [USER_ROLE.MENTOR],
      role: USER_ROLE.MENTOR,
    });

    expect(screen.getByText("보호 페이지")).toBeInTheDocument();
  });

  it("멘티가 멘토 전용 페이지에 접근하면 멘티 기본 페이지로 이동한다", () => {
    renderProtectedRoute({
      allowedRoles: [USER_ROLE.MENTOR],
      role: USER_ROLE.MENTEE,
    });

    expect(screen.getByText("멘티 기본 페이지")).toBeInTheDocument();
  });

  it("멘토가 멘티 전용 페이지에 접근하면 멘토 기본 페이지로 이동한다", () => {
    renderProtectedRoute({
      allowedRoles: [USER_ROLE.MENTEE],
      role: USER_ROLE.MENTOR,
    });

    expect(screen.getByText("멘토 기본 페이지")).toBeInTheDocument();
  });

  it("역할을 확인할 수 없으면 로그인 페이지로 이동한다", () => {
    renderProtectedRoute({ allowedRoles: [USER_ROLE.MENTEE] });

    expect(screen.getByText("로그인 페이지")).toBeInTheDocument();
  });

  it("지원하지 않는 역할이면 로그인 페이지로 이동한다", () => {
    renderProtectedRoute({
      allowedRoles: [USER_ROLE.MENTEE],
      role: "ROLE_ADMIN" as UserRole,
    });

    expect(screen.getByText("로그인 페이지")).toBeInTheDocument();
  });
});
