import {
  ASSIGNMENT_HELP_COPY,
  ASSIGNMENT_HELP_MESSAGE_BANK,
} from "../../../constants/";
import type {
  AssignmentHelpChatStageId,
  AssignmentHelpMessageKey,
  AssignmentHelpSectionProgressMap,
  AssignmentHelpState,
} from "../../../types/";
import { clamp01 } from "../../common";

type ProgressRange = readonly [number, number];

type AssignmentHelpChatStage = {
  id: AssignmentHelpChatStageId;
  messageIds: readonly AssignmentHelpMessageKey[];
  startAt: number;
  subtitle: string;
  subtitleKey: string;
};

// intro 구간 안에서 입력창이 언제 열리고 문구가 채워지는지 정함
const ASSIGNMENT_HELP_INTRO_PROGRESS_RANGES = {
  composerReveal: [0.25, 0.5] as ProgressRange,
  composerRevealEnd: 0.5,
  dotHoldEnd: 0.25,
  promptFill: [0.75, 1] as ProgressRange,
} as const;

// chat 구간 안에서 입력창이 내려가고 채팅이 보이는 시점을 정함
const ASSIGNMENT_HELP_CHAT_PROGRESS_RANGES = {
  dock: [0, 0.02] as ProgressRange,
  promptExit: [0.02, 0.15] as ProgressRange,
  userOnly: [0.15, 0.165] as ProgressRange,
} as const;

// time loss 구간 안에서 다음 장면이 열리는 시점을 정함
const ASSIGNMENT_HELP_TIME_LOSS_PROGRESS_RANGES = {
  backdropReveal: [0, 0.02] as ProgressRange,
  backdropRevealEnd: 0.02,
  composerSettle: [0, 0.01] as ProgressRange,
  holdEnd: 0.5,
} as const;

// chat 구간에서 어떤 메시지와 문구를 보여줄지 단계별로 정함
const ASSIGNMENT_HELP_CHAT_STAGES: readonly AssignmentHelpChatStage[] = [
  {
    id: "empty",
    messageIds: [],
    startAt: 0,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.common,
    subtitleKey: "empty",
  },
  {
    id: "userOnly",
    messageIds: ["userHelp"],
    startAt: 0.25,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.common,
    subtitleKey: "userOnly",
  },
  {
    id: "helpAndMethod",
    messageIds: ["userHelp", "aiMethod"],
    startAt: 0.375,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.methodology,
    subtitleKey: "helpAndMethod",
  },
  {
    id: "needInfo",
    messageIds: ["userHelp", "aiNeedInfo"],
    startAt: 0.5,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.tooManyInfo,
    subtitleKey: "needInfo",
  },
  {
    id: "userCrown",
    messageIds: ["userCrown"],
    startAt: 0.625,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.hallucination,
    subtitleKey: "userCrown",
  },
  {
    id: "hallucination",
    messageIds: ["userCrown", "aiHallucination"],
    startAt: 0.75,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.hallucination,
    subtitleKey: "hallucination",
  },
  {
    id: "correction",
    messageIds: ["userCrown", "aiHallucination", "userCorrection"],
    startAt: 0.875,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.repeatMistake,
    subtitleKey: "correction",
  },
  {
    id: "gaslight",
    messageIds: [
      "userCrown",
      "aiHallucination",
      "userCorrection",
      "aiGaslight",
    ],
    startAt: 1,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.repeatMistake,
    subtitleKey: "gaslight",
  },
] as const;

// 시작값과 끝값 사이 값을 진행도에 맞춰 구함
const lerp = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress;
};

// 특정 구간 안에서 현재 진행도를 0부터 1 사이 값으로 바꿈
const rangeProgress = (value: number, [start, end]: ProgressRange) => {
  if (start === end) {
    return 0;
  }

  return clamp01((value - start) / (end - start));
};

// chat 구간의 진행도에 맞는 현재 채팅 단계를 찾음
const resolveChatStage = (chatProgress: number) => {
  let activeStage = ASSIGNMENT_HELP_CHAT_STAGES[0];

  for (const candidate of ASSIGNMENT_HELP_CHAT_STAGES.slice(1)) {
    if (chatProgress >= candidate.startAt) {
      activeStage = candidate;
    }
  }

  return activeStage;
};

// 각 구간의 스크롤 진행도를 받아서, 화면에 보여줄 상태값으로 바꿈
export const deriveAssignmentHelpState = (
  sectionProgresses: AssignmentHelpSectionProgressMap,
): AssignmentHelpState => {
  const introProgress = clamp01(sectionProgresses.intro);
  const chatProgress = clamp01(sectionProgresses.chat);
  const timeLossProgress = clamp01(sectionProgresses.timeLoss);

  const hasChatStarted = chatProgress > 0 || timeLossProgress > 0;
  const hasTimeLossStarted = timeLossProgress > 0;

  const introComposerRevealProgress = hasChatStarted
    ? 1
    : rangeProgress(
        introProgress,
        ASSIGNMENT_HELP_INTRO_PROGRESS_RANGES.composerReveal,
      );
  const introPromptFillProgress = rangeProgress(
    introProgress,
    ASSIGNMENT_HELP_INTRO_PROGRESS_RANGES.promptFill,
  );
  const chatDockProgress = rangeProgress(
    chatProgress,
    ASSIGNMENT_HELP_CHAT_PROGRESS_RANGES.dock,
  );
  const chatPromptExitProgress = rangeProgress(
    chatProgress,
    ASSIGNMENT_HELP_CHAT_PROGRESS_RANGES.promptExit,
  );
  const chatAppearProgress = rangeProgress(
    chatProgress,
    ASSIGNMENT_HELP_CHAT_PROGRESS_RANGES.userOnly,
  );
  const timeLossComposerSettleProgress = rangeProgress(
    timeLossProgress,
    ASSIGNMENT_HELP_TIME_LOSS_PROGRESS_RANGES.composerSettle,
  );
  const timeLossBackdropRevealProgress = rangeProgress(
    timeLossProgress,
    ASSIGNMENT_HELP_TIME_LOSS_PROGRESS_RANGES.backdropReveal,
  );

  let composerWidth = "4px";
  let composerHeight = "4px";
  let composerRadius = "9999px";
  let composerPadding = "0px";
  let composerContentOpacity = 0;

  if (
    introProgress >= ASSIGNMENT_HELP_INTRO_PROGRESS_RANGES.dotHoldEnd ||
    hasChatStarted
  ) {
    const composerRevealProgress = hasChatStarted
      ? 1
      : clamp01(introComposerRevealProgress);

    composerWidth = `min(900px, calc(${Math.max(
      composerRevealProgress,
      0.04,
    ).toFixed(4)} * (100% - 80px)))`;
    composerHeight = `${lerp(4, 130, composerRevealProgress).toFixed(2)}px`;
    composerRadius = `${lerp(9999, 32, composerRevealProgress).toFixed(2)}px`;
    composerPadding = `${lerp(0, 24, composerRevealProgress).toFixed(2)}px`;
    composerContentOpacity =
      hasChatStarted ||
      introProgress >= ASSIGNMENT_HELP_INTRO_PROGRESS_RANGES.composerRevealEnd
        ? 1
        : 0;
  }

  const composerValue = ASSIGNMENT_HELP_COPY.helpPrompt;
  let composerValueReveal = introPromptFillProgress;

  if (hasChatStarted) {
    composerValueReveal = 1 - chatPromptExitProgress;
  }

  if (hasTimeLossStarted) {
    composerValueReveal = 0;
  }

  let composerTopPercent = 50;
  let composerTopOffsetPx = 154;

  if (hasChatStarted) {
    composerTopPercent = lerp(50, 100, chatDockProgress);
    composerTopOffsetPx = lerp(154, -89, chatDockProgress);
  }

  if (hasTimeLossStarted) {
    composerTopPercent = lerp(100, 50, timeLossComposerSettleProgress);
    composerTopOffsetPx = lerp(-89, 182, timeLossComposerSettleProgress);
  }

  const chatStage = resolveChatStage(chatProgress);
  const chatMessages = chatStage.messageIds.map((id) => {
    return ASSIGNMENT_HELP_MESSAGE_BANK[id];
  });
  const chatVisibilityBase =
    chatProgress >= ASSIGNMENT_HELP_CHAT_PROGRESS_RANGES.userOnly[0] ? 1 : 0;
  const chatOpacity =
    chatVisibilityBase *
    chatAppearProgress *
    (1 - timeLossComposerSettleProgress);
  const chatTranslateY = `${lerp(24, 0, chatAppearProgress).toFixed(2)}px`;

  const titleDockProgress = hasChatStarted ? chatDockProgress : 0;
  const titleTopPercent = lerp(50, 0, titleDockProgress);
  const titleTopOffsetPx = lerp(0, 136, titleDockProgress);
  const mainTitleTop = `calc(${titleTopPercent.toFixed(2)}% + ${titleTopOffsetPx.toFixed(2)}px)`;
  const mainTitleTransform = "translate(-50%, -50%)";
  const mainTitleOpacity = 1 - timeLossComposerSettleProgress;

  return {
    chat: {
      messageIds: chatStage.messageIds,
      messages: chatMessages,
      opacity: chatOpacity,
      stageId: chatStage.id,
      subtitle: chatStage.subtitle,
      translateY: chatTranslateY,
    },
    composer: {
      contentOpacity: composerContentOpacity,
      height: composerHeight,
      opacity: 1,
      padding: composerPadding,
      radius: composerRadius,
      topOffsetPx: composerTopOffsetPx,
      topPercent: composerTopPercent,
      value: composerValue,
      valueReveal: composerValueReveal,
      width: composerWidth,
    },
    flags: {
      isChatVisible: chatOpacity > 0.01,
      isSolutionReady:
        timeLossProgress >=
        ASSIGNMENT_HELP_TIME_LOSS_PROGRESS_RANGES.holdEnd - 0.001,
    },
    timeLoss: {
      backdropOpacity: timeLossBackdropRevealProgress,
      interactive:
        timeLossProgress >=
        ASSIGNMENT_HELP_TIME_LOSS_PROGRESS_RANGES.backdropRevealEnd,
      phraseOpacity: timeLossBackdropRevealProgress,
      titleOpacity: timeLossComposerSettleProgress,
    },
    title: {
      mainOpacity: mainTitleOpacity,
      mainTop: mainTitleTop,
      mainTransform: mainTitleTransform,
      subtitle: chatStage.subtitle,
      subtitleKey: chatStage.subtitleKey,
    },
  };
};
