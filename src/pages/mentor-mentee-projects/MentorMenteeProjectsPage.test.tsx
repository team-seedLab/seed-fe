import { Route, Routes } from "react-router";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DYNAMIC_ROUTE_PATHS, ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import MentorMenteeProjectsPage from "./MentorMenteeProjectsPage";

describe("MentorMenteeProjectsPage", () => {
  it("멘티 프로젝트 목록 페이지 기본 구조와 빈 상태를 표시한다", () => {
    renderWithProviders(
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
        initialEntries: [
          DYNAMIC_ROUTE_PATHS.MENTOR_MENTEE_PROJECTS("mentee-1"),
        ],
      },
    );

    expect(screen.getByText("멘티 프로젝트")).toBeInTheDocument();
    expect(screen.getByText("프로젝트 목록")).toBeInTheDocument();
    expect(
      screen.getByText("프로젝트 목록이 준비되면 여기에 표시됩니다."),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("이전 페이지")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("다음 페이지")).not.toBeInTheDocument();
  });
});
