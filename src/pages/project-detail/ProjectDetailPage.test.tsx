import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUserInfoStore } from "@/entities";
import { ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import ProjectDetailPage from "./ProjectDetailPage";

const navigateMock = vi.fn();
const useLocationMock = vi.fn();
const useGetProjectDetailMock = vi.fn();

vi.mock("@/features", () => ({
  ProjectDetailSection: () => null,
}));

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useGetProjectDetail: () => useGetProjectDetailMock(),
  };
});

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useLocation: () => useLocationMock(),
    useNavigate: () => navigateMock,
    useParams: () => ({ projectId: "mentor-project-1" }),
  };
});

describe("ProjectDetailPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    useLocationMock.mockReset();
    useLocationMock.mockReturnValue({ state: null });
    useGetProjectDetailMock.mockReturnValue({
      data: {
        projectId: "mentor-project-1",
        title: "환경학 개론 과제",
        roadmapType: "REPORT",
        status: "COMPLETED",
        createdAt: "2026-07-08T14:20:00",
        stepResponses: [],
      },
      isLoading: false,
    });
    useUserInfoStore.setState({
      userInfo: null,
      persistedProfile: {
        nickname: "mentor",
        profileUrl: "",
        role: "MENTOR",
      },
    });
  });

  it("backTo 값이 있으면 그 경로로 목록 버튼이 이동한다", () => {
    useLocationMock.mockReturnValue({
      state: {
        backTo: "/mentor/mentees/mentee-1/projects",
      },
    });

    renderWithProviders(<ProjectDetailPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /목록으로/ }));

    expect(navigateMock).toHaveBeenCalledWith(
      "/mentor/mentees/mentee-1/projects",
    );
  });

  it("backTo 값이 없으면 기존 멘토 진입 경로로 이동한다", () => {
    renderWithProviders(<ProjectDetailPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /목록으로/ }));

    expect(navigateMock).toHaveBeenCalledWith(ROUTE_PATHS.MENTOR_DASHBOARD);
  });
});
