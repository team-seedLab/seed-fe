import { describe, expect, it } from "vitest";

import { getMarkdownInputEdit } from "./get-markdown-input-edit";

describe("getMarkdownInputEdit", () => {
  it.each([
    {
      expected: "**강조**",
      key: "b",
      metaKey: false,
      value: "강조",
    },
    {
      expected: "*기울임*",
      key: "i",
      metaKey: true,
      value: "기울임",
    },
    {
      expected: "[링크](url)",
      key: "k",
      metaKey: false,
      value: "링크",
    },
  ])("Ctrl/Cmd+$key에 맞는 마크다운 문법을 적용한다", (testCase) => {
    const result = getMarkdownInputEdit({
      ctrlKey: !testCase.metaKey,
      key: testCase.key,
      metaKey: testCase.metaKey,
      selectionEnd: testCase.value.length,
      selectionStart: 0,
      shiftKey: false,
      value: testCase.value,
    });

    expect(result?.value).toBe(testCase.expected);
  });

  it("선택한 여러 줄을 Tab으로 들여쓴다", () => {
    const result = getMarkdownInputEdit({
      ctrlKey: false,
      key: "Tab",
      metaKey: false,
      selectionEnd: 9,
      selectionStart: 0,
      shiftKey: false,
      value: "첫째 줄\n둘째 줄",
    });

    expect(result).toEqual({
      selectionEnd: 17,
      selectionStart: 0,
      value: "    첫째 줄\n    둘째 줄",
    });
  });

  it("일반 문장 중간에서 Tab을 누르면 커서 위치에 공백을 입력한다", () => {
    const result = getMarkdownInputEdit({
      ctrlKey: false,
      key: "Tab",
      metaKey: false,
      selectionEnd: 2,
      selectionStart: 2,
      shiftKey: false,
      value: "첫째줄",
    });

    expect(result).toEqual({
      selectionEnd: 6,
      selectionStart: 6,
      value: "첫째    줄",
    });
  });

  it("줄 앞 공백 영역에서 Tab을 누르면 줄 전체를 들여쓴다", () => {
    const result = getMarkdownInputEdit({
      ctrlKey: false,
      key: "Tab",
      metaKey: false,
      selectionEnd: 2,
      selectionStart: 2,
      shiftKey: false,
      value: "  첫째 줄",
    });

    expect(result).toEqual({
      selectionEnd: 6,
      selectionStart: 6,
      value: "      첫째 줄",
    });
  });

  it("목록 줄에서 Tab을 누르면 기존처럼 줄 전체를 들여쓴다", () => {
    const value = "- 첫 번째";
    const result = getMarkdownInputEdit({
      ctrlKey: false,
      key: "Tab",
      metaKey: false,
      selectionEnd: value.length,
      selectionStart: value.length,
      shiftKey: false,
      value,
    });

    expect(result).toEqual({
      selectionEnd: value.length + 4,
      selectionStart: value.length + 4,
      value: `    ${value}`,
    });
  });

  it("링크 문법을 적용한 후 URL 입력 위치를 선택한다", () => {
    const result = getMarkdownInputEdit({
      ctrlKey: true,
      key: "k",
      metaKey: false,
      selectionEnd: 2,
      selectionStart: 0,
      shiftKey: false,
      value: "링크",
    });

    expect(result).toEqual({
      selectionEnd: 8,
      selectionStart: 5,
      value: "[링크](url)",
    });
  });

  it("Shift+Tab으로 현재 줄을 내어쓴다", () => {
    const result = getMarkdownInputEdit({
      ctrlKey: false,
      key: "Tab",
      metaKey: false,
      selectionEnd: 7,
      selectionStart: 7,
      shiftKey: true,
      value: "첫째 줄\n    둘째 줄",
    });

    expect(result).toEqual({
      selectionEnd: 5,
      selectionStart: 5,
      value: "첫째 줄\n둘째 줄",
    });
  });

  it.each([
    {
      expected: "- 첫 번째\n- ",
      label: "글머리 목록",
      value: "- 첫 번째",
    },
    {
      expected: "2. 두 번째\n3. ",
      label: "번호 목록",
      value: "2. 두 번째",
    },
    {
      expected: "    - 중첩 항목\n    - ",
      label: "중첩 목록",
      value: "    - 중첩 항목",
    },
  ])("$label에서 Enter를 누르면 다음 목록 기호를 입력한다", (testCase) => {
    const result = getMarkdownInputEdit({
      ctrlKey: false,
      key: "Enter",
      metaKey: false,
      selectionEnd: testCase.value.length,
      selectionStart: testCase.value.length,
      shiftKey: false,
      value: testCase.value,
    });

    expect(result).toEqual({
      selectionEnd: testCase.expected.length,
      selectionStart: testCase.expected.length,
      value: testCase.expected,
    });
  });

  it("빈 목록에서 Enter를 누르면 목록을 종료한다", () => {
    const value = "- 첫 번째\n- ";
    const expected = "- 첫 번째\n\n";

    expect(
      getMarkdownInputEdit({
        ctrlKey: false,
        key: "Enter",
        metaKey: false,
        selectionEnd: value.length,
        selectionStart: value.length,
        shiftKey: false,
        value,
      }),
    ).toEqual({
      selectionEnd: expected.length,
      selectionStart: expected.length,
      value: expected,
    });
  });

  it("아래에 문장이 있는 빈 목록을 종료하면 커서를 빈 줄에 유지한다", () => {
    const valueBeforeLine = "- 첫 번째\n";
    const value = `${valueBeforeLine}- \n다음 문장`;

    expect(
      getMarkdownInputEdit({
        ctrlKey: false,
        key: "Enter",
        metaKey: false,
        selectionEnd: valueBeforeLine.length + 2,
        selectionStart: valueBeforeLine.length + 2,
        shiftKey: false,
        value,
      }),
    ).toEqual({
      selectionEnd: valueBeforeLine.length,
      selectionStart: valueBeforeLine.length,
      value: `${valueBeforeLine}\n다음 문장`,
    });
  });

  it("Shift+Enter는 목록을 자동으로 이어서 입력하지 않는다", () => {
    const value = "- 첫 번째";

    expect(
      getMarkdownInputEdit({
        ctrlKey: false,
        key: "Enter",
        metaKey: false,
        selectionEnd: value.length,
        selectionStart: value.length,
        shiftKey: true,
        value,
      }),
    ).toBeNull();
  });

  it("지원하지 않는 키 입력은 변경하지 않는다", () => {
    expect(
      getMarkdownInputEdit({
        ctrlKey: false,
        key: "Enter",
        metaKey: false,
        selectionEnd: 0,
        selectionStart: 0,
        shiftKey: false,
        value: "",
      }),
    ).toBeNull();
  });
});
