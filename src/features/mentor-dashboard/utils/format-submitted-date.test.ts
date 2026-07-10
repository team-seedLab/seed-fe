import { describe, expect, it } from "vitest";

import { formatSubmittedDate } from "./format-submitted-date";

describe("formatSubmittedDate", () => {
  it("formats ISO-like dates to yyyy.mm.dd", () => {
    expect(formatSubmittedDate("2026-07-08T14:20:00")).toBe("2026.07.08");
  });

  it("returns dash when value is nullish or empty", () => {
    expect(formatSubmittedDate(null)).toBe("-");
    expect(formatSubmittedDate(undefined)).toBe("-");
    expect(formatSubmittedDate("")).toBe("-");
  });

  it("returns original value when date pattern does not match", () => {
    expect(formatSubmittedDate("invalid-date")).toBe("invalid-date");
  });
});
