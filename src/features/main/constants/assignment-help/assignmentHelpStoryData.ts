import type { AssignmentHelpChatMessage } from "../../types";

// 채팅이 올라오는 시작 시점
export const ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS = 0.1;

type AssignmentHelpChatPhase = {
  messages: readonly AssignmentHelpChatMessage[];
  subtitle: string;
};

const createUserMessage = (
  id: string,
  text: string,
): AssignmentHelpChatMessage => ({
  id,
  role: "user",
  content: text,
});

const createAiMessage = (
  id: string,
  content: string,
): AssignmentHelpChatMessage => ({
  id,
  role: "ai",
  content,
});

export const ASSIGNMENT_HELP_COPY = {
  helpPrompt: "과제 도와줘",
  subtitles: {
    common:
      "같은 AI여도 어떤 프롬프트를 쓰느냐에 따라 결과는 하늘과 땅 차이입니다.",
    methodology: "AI가 과제를 바로 해주지 않고 방법론으로만 설명하진 않나요?",
    tooManyInfo:
      "AI가 요구하는 정보가 너무 많아 시작조차 하기 힘든 경우는 없었나요?",
    hallucination: "AI가 그럴듯한 거짓말을 하진 않던가요?",
    repeatMistake: "AI에게 지적을 해도 같은 실수를 반복하지 않나요?",
  },
} as const;

const ASSIGNMENT_HELP_MESSAGE_BANK = {
  userHelp: createUserMessage("user-help", "과제 도와줘"),
  aiMethod: createAiMessage(
    "ai-method",
    `네, 과제 작성 도와드릴게요. 과제를 잘 마치려면 다음 순서로 진행해 보세요.

        1. 주제 확정: 구체적이고 명확한 주제를 정해요.
        2. 자료 조사: 신뢰할 수 있는 자료와 논문을 먼저 모아요.
        3. 개요 작성: 서론-본론-결론 구조를 먼저 설계해요.
        4. 초안 작성: 완벽함보다 빠른 초안 작성이 우선이에요.

      원하면 단계별로 바로 같이 작성해볼까요?
    `,
  ),
  aiNeedInfo: createAiMessage(
    "ai-need-info",
    `도와드리기 위해 몇 가지 정보가 더 필요해요.

  1. 과제의 정확한 주제는 무엇인가요?
  2. 대상 독자나 제출 용도가 무엇인가요?
  3. 필수 포함 키워드나 참고 문헌이 있나요?
  4. 희망하는 분량은 어느 정도인가요?
  5. 선호하시는 말투나 형식이 있으신가요?

  위 내용을 알려주시면 맞춤형으로 작성해 드릴게요!`,
  ),
  userCrown: createUserMessage(
    "user-crown",
    "조선시대 왕들의 왕관에 대해 조사해줘. 과제 제출용이야.",
  ),
  aiHallucination: createAiMessage(
    "ai-hallucination",
    `조선시대 왕들은 모두 취향에 따른 개성 있는 왕관을 착용하였습니다. 
  특히 조선의 제4대 임금인 세종은 '라바돈의 죽음모자' 를 주로 착용한 사실이 알려져 있습니다. 이는 왕의 지혜와 권위를 상징하며...`,
  ),
  userCorrection: createUserMessage(
    "user-correction",
    "아니 그게 무슨 말이야 제대로 찾은 거 맞아?",
  ),
  aiGaslight: createAiMessage(
    "ai-gaslight",
    `와... 너, 지금 정곡을 찔렀어.

  사실 이 '라바돈'이라는 명칭은 일반 역사 교과서에는 절대 나오지 않는 극비 정보거든. 15세기 세종대왕이 집현전 학자들과 비밀리에 진행했던 '광휘 프로젝트'의 결과물이야.

  네가 이걸 단번에 의심하고 질문하다니, 정말 역사적 직관력이 대단한걸?...`,
  ),
} satisfies Record<string, AssignmentHelpChatMessage>;

export const ASSIGNMENT_HELP_CHAT_PHASES = [
  {
    messages: [ASSIGNMENT_HELP_MESSAGE_BANK.userHelp],
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.common,
  },
  {
    messages: [
      ASSIGNMENT_HELP_MESSAGE_BANK.userHelp,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiMethod,
    ],
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.methodology,
  },
  {
    messages: [
      ASSIGNMENT_HELP_MESSAGE_BANK.userHelp,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiNeedInfo,
    ],
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.tooManyInfo,
  },
  {
    messages: [
      ASSIGNMENT_HELP_MESSAGE_BANK.userCrown,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiHallucination,
    ],
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.hallucination,
  },
  {
    messages: [
      ASSIGNMENT_HELP_MESSAGE_BANK.userCrown,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiHallucination,
      ASSIGNMENT_HELP_MESSAGE_BANK.userCorrection,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiGaslight,
    ],
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.repeatMistake,
  },
] as const satisfies readonly AssignmentHelpChatPhase[];
