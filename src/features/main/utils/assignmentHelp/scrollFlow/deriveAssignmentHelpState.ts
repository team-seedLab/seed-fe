import {
  ASSIGNMENT_HELP_COPY,
  ASSIGNMENT_HELP_MESSAGE_BANK,
} from "../../../constants/";
import type {
  AssignmentHelpChatMessage,
  AssignmentHelpChatStageId,
  AssignmentHelpSectionProgressMap,
  AssignmentHelpState,
} from "../../../types/";
import { clamp01 } from "../../common";

type ProgressRange = readonly [number, number];

type AssignmentHelpChatStage = {
  id: AssignmentHelpChatStageId;
  messages: readonly AssignmentHelpChatMessage[];
  startAt: number;
  subtitle: string;
};

const ASSIGNMENT_HELP_INTRO_PROGRESS_RANGES = {
  composerReveal: [0.25, 0.5] as ProgressRange,
  composerRevealEnd: 0.5,
  dotHoldEnd: 0.25,
  promptFill: [0.75, 1] as ProgressRange,
} as const;

const ASSIGNMENT_HELP_CHAT_PROGRESS_RANGES = {
  dock: [0, 0.02] as ProgressRange,
  promptExit: [0.02, 0.15] as ProgressRange,
  userOnly: [0.15, 0.165] as ProgressRange,
} as const;

const ASSIGNMENT_HELP_TIME_LOSS_PROGRESS_RANGES = {
  backdropReveal: [0, 0.02] as ProgressRange,
  backdropRevealEnd: 0.02,
  composerSettle: [0, 0.01] as ProgressRange,
  holdEnd: 0.5,
} as const;

const ASSIGNMENT_HELP_CHAT_STAGES: readonly AssignmentHelpChatStage[] = [
  {
    id: "empty",
    messages: [],
    startAt: 0,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.common,
  },
  {
    id: "userOnly",
    messages: [ASSIGNMENT_HELP_MESSAGE_BANK.userHelp],
    startAt: 0.25,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.common,
  },
  {
    id: "helpAndMethod",
    messages: [
      ASSIGNMENT_HELP_MESSAGE_BANK.userHelp,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiMethod,
    ],
    startAt: 0.375,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.methodology,
  },
  {
    id: "needInfo",
    messages: [
      ASSIGNMENT_HELP_MESSAGE_BANK.userHelp,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiNeedInfo,
    ],
    startAt: 0.5,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.tooManyInfo,
  },
  {
    id: "userCrown",
    messages: [ASSIGNMENT_HELP_MESSAGE_BANK.userCrown],
    startAt: 0.625,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.hallucination,
  },
  {
    id: "hallucination",
    messages: [
      ASSIGNMENT_HELP_MESSAGE_BANK.userCrown,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiHallucination,
    ],
    startAt: 0.75,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.hallucination,
  },
  {
    id: "correction",
    messages: [
      ASSIGNMENT_HELP_MESSAGE_BANK.userCrown,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiHallucination,
      ASSIGNMENT_HELP_MESSAGE_BANK.userCorrection,
    ],
    startAt: 0.875,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.repeatMistake,
  },
  {
    id: "gaslight",
    messages: [
      ASSIGNMENT_HELP_MESSAGE_BANK.userCrown,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiHallucination,
      ASSIGNMENT_HELP_MESSAGE_BANK.userCorrection,
      ASSIGNMENT_HELP_MESSAGE_BANK.aiGaslight,
    ],
    startAt: 1,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.repeatMistake,
  },
] as const;

const lerp = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress;
};

const rangeProgress = (value: number, [start, end]: ProgressRange) => {
  if (start === end) {
    return 0;
  }

  return clamp01((value - start) / (end - start));
};

const resolveChatStage = (chatProgress: number) => {
  let activeStage = ASSIGNMENT_HELP_CHAT_STAGES[0];

  for (const candidate of ASSIGNMENT_HELP_CHAT_STAGES.slice(1)) {
    if (chatProgress >= candidate.startAt) {
      activeStage = candidate;
    }
  }

  return activeStage;
};

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
  const chatMessages = chatStage.messages;
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
    },
  };
};
