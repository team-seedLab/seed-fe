import { describe, expect, it } from "vitest";

import { getSelfCheckAnswerLength } from "./get-self-check-answer-length";

describe("getSelfCheckAnswerLength", () => {
  it("공백을 제외한 유니코드 문자 수를 계산한다", () => {
    expect(getSelfCheckAnswerLength("이해한 내용 입니다\n다시 확인")).toBe(12);
    expect(getSelfCheckAnswerLength("가 나 다")).toBe(3);
  });
});
