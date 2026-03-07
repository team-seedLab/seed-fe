import {
  ASSIGNMENT_HELP_COPY,
  ASSIGNMENT_HELP_MESSAGE_BANK,
} from "../constants/assignmentHelpStoryData";
import type {
  AssignmentHelpSectionProgressMap,
  AssignmentHelpState,
} from "../types/assignmentHelp";

import { resolveAssignmentHelpChatStage } from "./resolveAssignmentHelpChatStage";

type ProgressRange = readonly [number, number];

const INTRO_PROGRESS = {
  composerReveal: [0.25, 0.5] as ProgressRange,
  composerRevealEnd: 0.5,
  dotHoldEnd: 0.25,
  promptFill: [0.75, 1] as ProgressRange,
} as const;

const CHAT_PROGRESS = {
  dock: [0, 0.0238] as ProgressRange,
  promptExit: [0.0238, 0.1429] as ProgressRange,
  userOnly: [0.1429, 0.2619] as ProgressRange,
} as const;

const TIME_LOSS_PROGRESS = {
  backdropReveal: [0.3333, 0.6667] as ProgressRange,
  backdropRevealEnd: 0.6667,
  composerSettle: [0, 0.3333] as ProgressRange,
  holdEnd: 1,
} as const;

const clamp01 = (value: number) => {
  return Math.min(1, Math.max(0, value));
};

const lerp = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress;
};

const invLerp = (start: number, end: number, value: number) => {
  if (start === end) {
    return 0;
  }

  return (value - start) / (end - start);
};

const rangeProgress = (value: number, [start, end]: ProgressRange) => {
  return clamp01(invLerp(start, end, value));
};

const stepAt = (value: number, threshold: number) => {
  return value >= threshold ? 1 : 0;
};

const widthByScale = (scale: number) => {
  return `min(900px, calc(${scale.toFixed(4)} * (100% - 80px)))`;
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
    : rangeProgress(introProgress, INTRO_PROGRESS.composerReveal);
  const introPromptFillProgress = rangeProgress(
    introProgress,
    INTRO_PROGRESS.promptFill,
  );
  const chatDockProgress = rangeProgress(chatProgress, CHAT_PROGRESS.dock);
  const chatPromptExitProgress = rangeProgress(
    chatProgress,
    CHAT_PROGRESS.promptExit,
  );
  const chatAppearProgress = rangeProgress(
    chatProgress,
    CHAT_PROGRESS.userOnly,
  );
  const timeLossComposerSettleProgress = rangeProgress(
    timeLossProgress,
    TIME_LOSS_PROGRESS.composerSettle,
  );
  const timeLossBackdropRevealProgress = rangeProgress(
    timeLossProgress,
    TIME_LOSS_PROGRESS.backdropReveal,
  );

  let composerWidth = "4px";
  let composerHeight = "4px";
  let composerRadius = "9999px";
  let composerPadding = "0px";
  let composerContentOpacity = 0;

  if (introProgress >= INTRO_PROGRESS.dotHoldEnd || hasChatStarted) {
    const composerRevealProgress = hasChatStarted
      ? 1
      : clamp01(introComposerRevealProgress);

    composerWidth = widthByScale(Math.max(composerRevealProgress, 0.04));
    composerHeight = `${lerp(4, 130, composerRevealProgress).toFixed(2)}px`;
    composerRadius = `${lerp(9999, 32, composerRevealProgress).toFixed(2)}px`;
    composerPadding = `${lerp(0, 24, composerRevealProgress).toFixed(2)}px`;
    composerContentOpacity =
      hasChatStarted || introProgress >= INTRO_PROGRESS.composerRevealEnd
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

  const chatStage = resolveAssignmentHelpChatStage(chatProgress);
  const chatMessages = chatStage.messageIds.map((id) => {
    return ASSIGNMENT_HELP_MESSAGE_BANK[id];
  });
  const chatVisibilityBase = stepAt(chatProgress, CHAT_PROGRESS.userOnly[0]);
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
      isSolutionReady: timeLossProgress >= TIME_LOSS_PROGRESS.holdEnd - 0.001,
    },
    timeLoss: {
      backdropOpacity: timeLossBackdropRevealProgress,
      interactive: timeLossProgress >= TIME_LOSS_PROGRESS.backdropRevealEnd,
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
