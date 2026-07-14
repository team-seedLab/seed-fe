const NEXT_QUESTION_GUIDE_PATTERN = /^#{2,4}\s+다음 질문 가이드\s*$/m;

type AiMentorAnswerSections = {
  answer: string;
  guide: string | null;
};

export const splitAiMentorAnswer = (
  content: string,
): AiMentorAnswerSections => {
  const guideHeading = content.match(NEXT_QUESTION_GUIDE_PATTERN);

  if (!guideHeading || guideHeading.index === undefined) {
    return {
      answer: content.trim(),
      guide: null,
    };
  }

  const guideStart = guideHeading.index + guideHeading[0].length;

  return {
    answer: content.slice(0, guideHeading.index).trim(),
    guide: content.slice(guideStart).trim(),
  };
};
