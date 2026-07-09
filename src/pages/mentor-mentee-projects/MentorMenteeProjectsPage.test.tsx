import { Route, Routes } from "react-router";

import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DYNAMIC_ROUTE_PATHS, ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import MentorMenteeProjectsPage from "./MentorMenteeProjectsPage";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("MentorMenteeProjectsPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("선택한 멘티의 프로젝트 목록과 첫 페이지를 표시한다", () => {
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

    expect(screen.getByText("김서연")).toBeInTheDocument();
    expect(screen.getByText("프로젝트 목록")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /환경학 개론 과제/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /UI 디자인 시스템 구축/ }),
    ).toBeInTheDocument();
  });

  it("필터를 변경하면 해당 상태의 프로젝트만 보여준다", () => {
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

    fireEvent.click(screen.getByRole("button", { name: "완료" }));

    expect(
      screen.queryByRole("button", { name: /환경학 개론 과제/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /2024 마케팅 기획안/ }),
    ).toBeInTheDocument();
  });

  it("프로젝트 카드를 클릭하면 상세 페이지로 이동한다", () => {
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

    fireEvent.click(screen.getByRole("button", { name: /환경학 개론 과제/ }));

    expect(navigateMock).toHaveBeenCalledWith(
      DYNAMIC_ROUTE_PATHS.PROJECT_DETAIL("mentor-project-1"),
      {
        state: {
          backTo: DYNAMIC_ROUTE_PATHS.MENTOR_MENTEE_PROJECTS("mentee-1"),
        },
      },
    );
  });
});
