import { Route, Routes } from "react-router";

import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { RootLayout } from "./RootLayout";

vi.mock("../components", () => ({
  Footer: () => <footer>푸터</footer>,
  Header: () => <header>헤더</header>,
}));

const renderRootLayout = (initialEntry: string) => {
  return renderWithProviders(
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<div>페이지 콘텐츠</div>} path="*" />
      </Route>
    </Routes>,
    { initialEntries: [initialEntry] },
  );
};

describe("RootLayout", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it("일반 페이지에서는 푸터를 표시한다", () => {
    renderRootLayout("/mypage");

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("업로드 단계에서도 기존 푸터를 표시한다", () => {
    renderRootLayout("/upload/step/project-1/1");

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("페이지 콘텐츠")).toBeInTheDocument();
  });
});
