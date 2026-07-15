import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUserInfoStore } from "@/entities";
import { ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import ProjectDetailPage from "./ProjectDetailPage";

const navigateMock = vi.fn();
const useLocationMock = vi.fn();
const useGetMentorProjectDetailMock = vi.fn();
const useGetProjectDetailMock = vi.fn();

vi.mock("@/features", async () => {
  const actual =
    await vi.importActual<typeof import("@/features")>("@/features");

  return {
    ...actual,
    MentorProjectDetailSection: () => <div>멘토 프로젝트 리포트</div>,
    ProjectDetailSection: () => null,
  };
});

vi.mock("@/entities", async () => {
  const actual =
    await vi.importActual<typeof import("@/entities")>("@/entities");

  return {
    ...actual,
    useGetMentorProjectDetail: (...args: unknown[]) =>
      useGetMentorProjectDetailMock(...args),
    useGetProjectDetail: (...args: unknown[]) =>
      useGetProjectDetailMock(...args),
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
    useGetMentorProjectDetailMock.mockReset();
    useGetProjectDetailMock.mockReset();
    useLocationMock.mockReturnValue({ state: null });
    useGetProjectDetailMock.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isLoading: false,
    });
    useGetMentorProjectDetailMock.mockReturnValue({
      data: {
        completedAt: "2026-07-10T14:20:00",
        desiredOutcome: null,
        keyFocus: null,
        projectId: "mentor-project-1",
        reviewStatus: "REVIEWING",
        reviewedAt: null,
        roadmapType: "REPORT",
        requiredElements: null,
        status: "COMPLETED",
        studentId: "mentee-1",
        studentNickname: "김멘티",
        title: "환경학 개론 과제",
        createdAt: "2026-07-08T14:20:00",
        steps: [],
        updatedAt: "2026-07-10T14:20:00",
      },
      error: null,
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
    expect(
      screen.getByRole("heading", { level: 1, name: "환경학 개론 과제" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2026.07.08 - 2026.07.10")).toBeInTheDocument();
    expect(screen.getByText("완료됨")).toBeInTheDocument();
    expect(screen.getByText("멘토 프로젝트 리포트")).toBeInTheDocument();
    expect(useGetProjectDetailMock).toHaveBeenCalledWith(
      "mentor-project-1",
      false,
    );
    expect(useGetMentorProjectDetailMock).toHaveBeenCalledWith(
      "mentor-project-1",
      true,
    );
  });

  it("프로젝트 조회에 실패하면 오류 상태를 표시한다", () => {
    useGetMentorProjectDetailMock.mockReturnValue({
      data: undefined,
      error: new Error("조회 실패"),
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
    useGetMentorProjectDetailMock.mockReturnValue({
      data: undefined,
      error: null,
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

  it("멘티 역할은 기존 프로젝트 상세 조회를 유지한다", () => {
    useUserInfoStore.setState({
      userInfo: null,
      persistedProfile: {
        nickname: "mentee",
        profileUrl: "",
        role: "MENTEE",
      },
    });
    useGetProjectDetailMock.mockReturnValue({
      data: {
        completedAt: null,
        completedStepCount: 1,
        currentStepCode: "argument_structuring",
        currentStepOrder: 2,
        desiredOutcome: null,
        keyFocus: null,
        projectId: "mentor-project-1",
        progressPercent: 25,
        requiredElements: null,
        roadmapType: "REPORT",
        status: "IN_PROGRESS",
        title: "멘티 프로젝트",
        createdAt: "2026-07-08T14:20:00",
        steps: [],
        totalStepCount: 4,
        updatedAt: "2026-07-10T14:20:00",
      },
      error: null,
      isError: false,
      isLoading: false,
    });

    renderWithProviders(<ProjectDetailPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "멘티 프로젝트" }),
    ).toBeInTheDocument();
    expect(useGetProjectDetailMock).toHaveBeenCalledWith(
      "mentor-project-1",
      true,
    );
    expect(useGetMentorProjectDetailMock).toHaveBeenCalledWith(
      "mentor-project-1",
      false,
    );
  });

  it("역할 정보가 없으면 프로젝트 상세 API를 호출하지 않고 오류를 표시한다", () => {
    useUserInfoStore.setState({
      userInfo: null,
      persistedProfile: null,
    });

    renderWithProviders(<ProjectDetailPage />, {
      authValue: {
        isAuthenticated: true,
        isLoading: false,
      },
    });

    expect(useGetProjectDetailMock).toHaveBeenCalledWith(
      "mentor-project-1",
      false,
    );
    expect(useGetMentorProjectDetailMock).toHaveBeenCalledWith(
      "mentor-project-1",
      false,
    );
    expect(
      screen.getByText("사용자 역할 정보를 확인하지 못했습니다."),
    ).toBeInTheDocument();
  });
});
