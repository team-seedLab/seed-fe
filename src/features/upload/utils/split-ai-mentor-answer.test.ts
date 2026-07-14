import { describe, expect, it } from "vitest";

import { splitAiMentorAnswer } from "./split-ai-mentor-answer";

describe("splitAiMentorAnswer", () => {
  it("핵심 답변과 다음 질문 가이드를 분리한다", () => {
    const result = splitAiMentorAnswer(`핵심 답변입니다.

### 다음 질문 가이드
- 보완할 정보: 자료 범위
- 이렇게 질문해 보세요: "자료 범위를 비교해 주세요."
- 프롬프트 수정 방향: 결과 형식을 추가하세요.`);

    expect(result).toEqual({
      answer: "핵심 답변입니다.",
      guide:
        '- 보완할 정보: 자료 범위\n- 이렇게 질문해 보세요: "자료 범위를 비교해 주세요."\n- 프롬프트 수정 방향: 결과 형식을 추가하세요.',
    });
  });

  it("가이드 구분자가 없으면 전체 내용을 핵심 답변으로 사용한다", () => {
    expect(splitAiMentorAnswer("일반 답변입니다.")).toEqual({
      answer: "일반 답변입니다.",
      guide: null,
    });
  });

  it.each(["##", "####"])(
    "%s 헤더로 작성된 다음 질문 가이드도 분리한다",
    (heading) => {
      const result = splitAiMentorAnswer(`핵심 답변입니다.

${heading} 다음 질문 가이드
- 보완할 정보: 자료 범위`);

      expect(result).toEqual({
        answer: "핵심 답변입니다.",
        guide: "- 보완할 정보: 자료 범위",
      });
    },
  );
});
