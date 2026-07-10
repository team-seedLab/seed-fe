import { describe, expect, it } from "vitest";

import { createPromptDiff } from "./create-prompt-diff";

describe("createPromptDiff", () => {
  it("변경되지 않은 프롬프트를 동일한 줄로 반환한다", () => {
    const result = createPromptDiff(
      "첫 번째 줄\n두 번째 줄",
      "첫 번째 줄\n두 번째 줄",
    );

    expect(result).toEqual({
      addedCount: 0,
      hasChanges: false,
      lines: [
        { content: "첫 번째 줄", type: "unchanged" },
        { content: "두 번째 줄", type: "unchanged" },
      ],
      removedCount: 0,
    });
  });

  it("교체된 한 줄을 삭제 한 줄과 추가 한 줄로 계산한다", () => {
    const result = createPromptDiff(
      "제약사항\n분량: 제한 없음\n출력 형식",
      "제약사항\n분량: A4 2장\n출력 형식",
    );

    expect(result.lines).toEqual([
      { content: "제약사항", type: "unchanged" },
      { content: "분량: 제한 없음", type: "removed" },
      { content: "분량: A4 2장", type: "added" },
      { content: "출력 형식", type: "unchanged" },
    ]);
    expect(result.addedCount).toBe(1);
    expect(result.removedCount).toBe(1);
    expect(result.hasChanges).toBe(true);
  });

  it("여러 줄의 추가와 삭제 개수를 각각 계산한다", () => {
    const result = createPromptDiff("A\nB\nC", "A\nD\nE");

    expect(result.addedCount).toBe(2);
    expect(result.removedCount).toBe(2);
  });

  it("CRLF와 마지막 줄바꿈 차이는 변경으로 계산하지 않는다", () => {
    const result = createPromptDiff("첫 줄\r\n둘째 줄\r\n", "첫 줄\n둘째 줄");

    expect(result.addedCount).toBe(0);
    expect(result.removedCount).toBe(0);
    expect(result.hasChanges).toBe(false);
    expect(result.lines).toEqual([
      { content: "첫 줄", type: "unchanged" },
      { content: "둘째 줄", type: "unchanged" },
    ]);
  });
});
