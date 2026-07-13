import { fireEvent, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MentorLoginRequest } from "@/entities";
import { ROUTE_PATHS } from "@/shared";
import {
  createApiErrorResponse,
  createApiSuccessResponse,
} from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/test-utils";

import MentorLoginPage from "./MentorLoginPage";

const navigateMock = vi.fn();
const loginMock = vi.fn<() => Promise<void>>();

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const submitLoginForm = () => {
  fireEvent.change(screen.getByPlaceholderText("이메일 주소"), {
    target: { value: "mentor@seed.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("비밀번호"), {
    target: { value: "mentor-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "로그인" }));
};

describe("MentorLoginPage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    loginMock.mockReset();
    loginMock.mockResolvedValue(undefined);
  });

  it("로그인 성공 시 인증 상태를 동기화하고 멘토 대시보드로 이동한다", async () => {
    let requestBody: MentorLoginRequest | null = null;

    server.use(
      http.post("*/api/auth/mentor/login", async ({ request }) => {
        requestBody = (await request.json()) as MentorLoginRequest;
        return HttpResponse.json(
          createApiSuccessResponse("멘토 로그인에 성공했습니다."),
        );
      }),
    );

    renderWithProviders(<MentorLoginPage />, {
      authValue: { login: loginMock },
    });

    submitLoginForm();

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(ROUTE_PATHS.MENTOR_DASHBOARD, {
        replace: true,
      });
    });

    expect(requestBody).toEqual({
      email: "mentor@seed.com",
      password: "mentor-password",
    });
    expect(loginMock).toHaveBeenCalledOnce();
  });

  it("로그인 실패 시 오류를 표시하고 토큰 재발급을 요청하지 않는다", async () => {
    let reissueRequestCount = 0;

    server.use(
      http.post("*/api/auth/mentor/login", () => {
        return HttpResponse.json(
          createApiErrorResponse({
            errorCode: "A001",
            errorMessage: "이메일 또는 비밀번호가 올바르지 않습니다.",
          }),
          { status: 401 },
        );
      }),
      http.post("*/api/auth/reissue", () => {
        reissueRequestCount += 1;
        return HttpResponse.json(createApiSuccessResponse(null));
      }),
    );

    renderWithProviders(<MentorLoginPage />, {
      authValue: { login: loginMock },
    });

    submitLoginForm();

    expect(
      await screen.findByText(
        "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
      ),
    ).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(reissueRequestCount).toBe(0);
  });

  it("로그인 후 사용자 정보 동기화에 실패하면 이동하지 않는다", async () => {
    loginMock.mockRejectedValue(new Error("사용자 정보 조회 실패"));

    server.use(
      http.post("*/api/auth/mentor/login", () => {
        return HttpResponse.json(
          createApiSuccessResponse("멘토 로그인에 성공했습니다."),
        );
      }),
    );

    renderWithProviders(<MentorLoginPage />, {
      authValue: { login: loginMock },
    });

    submitLoginForm();

    expect(
      await screen.findByText(
        "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
      ),
    ).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
