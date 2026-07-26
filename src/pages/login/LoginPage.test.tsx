import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ROUTE_PATHS } from "@/shared";
import { renderWithProviders } from "@/test/test-utils";

import LoginPage from "./LoginPage";

describe("LoginPage", () => {
  it("소셜 로그인과 멘토 로그인 페이지 진입점을 표시한다", () => {
    renderWithProviders(<LoginPage />);

    expect(
      screen.getByRole("button", { name: /카카오 로그인/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Google 로그인/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "멘토로 로그인하기" }),
    ).toHaveAttribute("href", ROUTE_PATHS.MENTOR_LOGIN);
  });
});
