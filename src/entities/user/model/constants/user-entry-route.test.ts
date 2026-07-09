import { describe, expect, it } from "vitest";

import { ROUTE_PATHS } from "@/shared";

import { getUserEntryRoutePath } from "./user-entry-route";

describe("getUserEntryRoutePath", () => {
  it("MENTEE ??븷?대㈃ 留덉씠?섏씠吏 寃쎈줈瑜?諛섑솚?쒕떎", () => {
    expect(getUserEntryRoutePath("MENTEE")).toBe(ROUTE_PATHS.MYPAGE);
  });

  it("MENTOR ??븷?대㈃ 硫섑넗 ??ㅼ떆蹂대뱶 寃쎈줈瑜?諛섑솚?쒕떎", () => {
    expect(getUserEntryRoutePath("MENTOR")).toBe(ROUTE_PATHS.MENTOR_DASHBOARD);
  });

  it("role ??undefined ?대㈃ 留덉씠?섏씠吏 寃쎈줈瑜?諛섑솚?쒕떎", () => {
    expect(getUserEntryRoutePath(undefined)).toBe(ROUTE_PATHS.MYPAGE);
  });

  it("role ??null ?대㈃ 留덉씠?섏씠吏 寃쎈줈瑜?諛섑솚?쒕떎", () => {
    expect(getUserEntryRoutePath(null)).toBe(ROUTE_PATHS.MYPAGE);
  });
});
