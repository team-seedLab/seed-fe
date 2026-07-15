import { describe, expect, it } from "vitest";

import { formatUpdatedDate } from "./format-updated-date";

describe("formatUpdatedDate", () => {
  it("ISO 날짜 문자열을 점으로 구분된 날짜로 변환한다", () => {
    expect(formatUpdatedDate("2026-07-08T14:20:00")).toBe("2026.07.08");
  });

  it("날짜가 없으면 대시를 반환한다", () => {
    expect(formatUpdatedDate(null)).toBe("-");
    expect(formatUpdatedDate(undefined)).toBe("-");
    expect(formatUpdatedDate("")).toBe("-");
  });

  it("날짜 형식이 아니면 원본을 반환한다", () => {
    expect(formatUpdatedDate("invalid-date")).toBe("invalid-date");
  });
});
