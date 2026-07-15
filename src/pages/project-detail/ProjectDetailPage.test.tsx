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
        completedAt: "2026-07-10T14:20:00",
        completedStepCount: 3,
        currentStepCode: null,
        currentStepOrder: null,
        desiredOutcome: null,
        keyFocus: null,
        projectId: "mentor-project-1",
        title: "환경학 개론 과제",
        roadmapType: "REPORT",
        progressPercent: 100,
        requiredElements: null,
        status: "COMPLETED",
        createdAt: "2026-07-08T14:20:00",
        steps: [],
        totalStepCount: 3,
        updatedAt: "2026-07-10T14:20:00",
      },
      isError: false,
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

  it("프로젝트 제목과 기간, 상태를 표시한다", () => {
    renderWithProviders(<ProjectDetailPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    expect(screen.getByText("글쓰기형")).toBeInTheDocument();
    expect(screen.getByText("환경학 개론 과제")).toBeInTheDocument();
    expect(screen.getByText("2026.07.08 - 2026.07.10")).toBeInTheDocument();
    expect(screen.getByText("완료됨")).toBeInTheDocument();
  });

  it("프로젝트 조회에 실패하면 오류 상태를 표시한다", () => {
    useGetProjectDetailMock.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
    });

    renderWithProviders(<ProjectDetailPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    expect(
      screen.getByText("프로젝트 정보를 불러오지 못했습니다."),
    ).toBeInTheDocument();
  });

  it("프로젝트 응답이 없으면 빈 상태를 표시한다", () => {
    useGetProjectDetailMock.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: false,
    });

    renderWithProviders(<ProjectDetailPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    expect(screen.getByText("프로젝트 정보가 없습니다.")).toBeInTheDocument();
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
