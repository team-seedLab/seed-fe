import { describe, expect, it } from "vitest";

import { ROUTE_PATHS } from "@/shared";

import { getUserEntryRoutePath } from "./user-entry-route";

describe("getUserEntryRoutePath", () => {
  it("MENTEE 역할이면 마이페이지 경로를 반환한다", () => {
    expect(getUserEntryRoutePath("MENTEE")).toBe(ROUTE_PATHS.MYPAGE);
  });

  it("MENTOR 역할이면 현재 기본 마이페이지 경로로 fallback 한다", () => {
    expect(getUserEntryRoutePath("MENTOR")).toBe(ROUTE_PATHS.MYPAGE);
  });

  it("role 이 undefined 이면 마이페이지 경로를 반환한다", () => {
    expect(getUserEntryRoutePath(undefined)).toBe(ROUTE_PATHS.MYPAGE);
  });

  it("role 이 null 이면 마이페이지 경로를 반환한다", () => {
    expect(getUserEntryRoutePath(null)).toBe(ROUTE_PATHS.MYPAGE);
  });
});
