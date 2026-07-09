import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DYNAMIC_ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import {
  SAMPLE_MENTEE_ID,
  SAMPLE_MENTOR_MENTEE_PROJECTS,
} from "../../test/mentor-dashboard.samples";

import { MentorMenteeProjectListSection } from "./MentorMenteeProjectListSection";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("MentorMenteeProjectListSection", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("프로젝트 목록을 표시한다", () => {
    renderWithProviders(
      <MentorMenteeProjectListSection
        menteeId={SAMPLE_MENTEE_ID}
        projects={SAMPLE_MENTOR_MENTEE_PROJECTS}
      />,
    );

    expect(screen.getByText("프로젝트 목록")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /심리학 개론 과제/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /브랜드 리서치 보고서/ }),
    ).toBeInTheDocument();
  });

  it("필터를 변경하면 완료된 프로젝트만 보여준다", () => {
    renderWithProviders(
      <MentorMenteeProjectListSection
        menteeId={SAMPLE_MENTEE_ID}
        projects={SAMPLE_MENTOR_MENTEE_PROJECTS}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "완료" }));

    expect(
      screen.queryByRole("button", { name: /심리학 개론 과제/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /브랜드 리서치 보고서/ }),
    ).toBeInTheDocument();
  });

  it("프로젝트를 선택하면 상세 페이지로 이동한다", () => {
    renderWithProviders(
      <MentorMenteeProjectListSection
        menteeId={SAMPLE_MENTEE_ID}
        projects={SAMPLE_MENTOR_MENTEE_PROJECTS}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /심리학 개론 과제/ }));

    expect(navigateMock).toHaveBeenCalledWith(
      DYNAMIC_ROUTE_PATHS.PROJECT_DETAIL("mentor-project-1"),
      {
        state: {
          backTo: DYNAMIC_ROUTE_PATHS.MENTOR_MENTEE_PROJECTS(SAMPLE_MENTEE_ID),
        },
      },
    );
  });
});
