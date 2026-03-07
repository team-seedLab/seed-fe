import {
  COPY,
  type MessageKey,
  type PromptMessage,
  resolveMessageIds,
} from "../constants/promptStoryData";
import {
  STORY_SCENE_PROGRESS,
  type StorySceneId,
  type StorySectionProgressMap,
} from "../constants/storySections";

type ProgressRange = readonly [number, number];

export const clamp01 = (value: number) => {
  return Math.min(1, Math.max(0, value));
};

export const lerp = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress;
};

export const invLerp = (start: number, end: number, value: number) => {
  if (start === end) {
    return 0;
  }

  return (value - start) / (end - start);
};

export const rangeProgress = (value: number, [start, end]: ProgressRange) => {
  return clamp01(invLerp(start, end, value));
};

export const stepAt = (value: number, threshold: number) => {
  return value >= threshold ? 1 : 0;
};

const widthByScale = (scale: number) => {
  return `min(900px, calc(${scale.toFixed(4)} * (100% - 80px)))`;
};

const sceneRange = (sceneId: StorySceneId): ProgressRange => {
  const scene = STORY_SCENE_PROGRESS[sceneId];
  return [scene.start, scene.end];
};

const sceneEnd = (sceneId: StorySceneId) => {
  return STORY_SCENE_PROGRESS[sceneId].end;
};

const sceneStart = (sceneId: StorySceneId) => {
  return STORY_SCENE_PROGRESS[sceneId].start;
};

export type ChatStageId =
  | "empty"
  | "userOnly"
  | "helpAndMethod"
  | "needInfo"
  | "userCrown"
  | "hallucination"
  | "correction"
  | "gaslight";

type ChatStage = {
  id: ChatStageId;
  messageIds: readonly MessageKey[];
  sceneId: StorySceneId | null;
  subtitle: string;
  subtitleKey: string;
};

const CHAT_STAGES: readonly ChatStage[] = [
  {
    id: "empty",
    messageIds: [],
    sceneId: null,
    subtitle: COPY.subtitles.common,
    subtitleKey: "empty",
  },
  {
    id: "userOnly",
    messageIds: ["userHelp"],
    sceneId: "chatUserOnly",
    subtitle: COPY.subtitles.common,
    subtitleKey: "userOnly",
  },
  {
    id: "helpAndMethod",
    messageIds: ["userHelp", "aiMethod"],
    sceneId: "chatHelpAndMethod",
    subtitle: COPY.subtitles.methodology,
    subtitleKey: "helpAndMethod",
  },
  {
    id: "needInfo",
    messageIds: ["userHelp", "aiNeedInfo"],
    sceneId: "chatNeedInfo",
    subtitle: COPY.subtitles.tooManyInfo,
    subtitleKey: "needInfo",
  },
  {
    id: "userCrown",
    messageIds: ["userCrown"],
    sceneId: "chatUserCrown",
    subtitle: COPY.subtitles.hallucination,
    subtitleKey: "userCrown",
  },
  {
    id: "hallucination",
    messageIds: ["userCrown", "aiHallucination"],
    sceneId: "chatHallucination",
    subtitle: COPY.subtitles.hallucination,
    subtitleKey: "hallucination",
  },
  {
    id: "correction",
    messageIds: ["userCrown", "aiHallucination", "userCorrection"],
    sceneId: "chatCorrection",
    subtitle: COPY.subtitles.repeatMistake,
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
    sceneId: "chatGaslight",
    subtitle: COPY.subtitles.repeatMistake,
    subtitleKey: "gaslight",
  },
] as const;

const resolveChatStage = (chatProgress: number) => {
  let activeStage = CHAT_STAGES[0];

  for (const candidate of CHAT_STAGES.slice(1)) {
    if (candidate.sceneId && chatProgress >= sceneStart(candidate.sceneId)) {
      activeStage = candidate;
    }
  }

  return activeStage;
};

export type ComposerLayoutState = {
  contentOpacity: number;
  height: string;
  opacity: number;
  padding: string;
  radius: string;
  topOffsetPx: number;
  topPercent: number;
  value: string;
  valueReveal: number;
  width: string;
};

export type MainStoryState = {
  chat: {
    messageIds: readonly MessageKey[];
    messages: PromptMessage[];
    opacity: number;
    stageId: ChatStageId;
    subtitle: string;
    translateY: string;
  };
  composer: ComposerLayoutState;
  flags: {
    isChatVisible: boolean;
    isSolutionReady: boolean;
  };
  next: {
    backdropOpacity: number;
    interactive: boolean;
    phraseOpacity: number;
    titleOpacity: number;
  };
  problemDefinitionLayer: {
    opacity: number;
    translateY: string;
  };
  title: {
    mainOpacity: number;
    mainTop: string;
    mainTransform: string;
    subtitle: string;
    subtitleKey: string;
  };
};

export const deriveMainStoryState = (
  sectionProgresses: StorySectionProgressMap,
): MainStoryState => {
  const introProgress = clamp01(sectionProgresses.intro);
  const chatProgress = clamp01(sectionProgresses.chat);
  const nextProgress = clamp01(sectionProgresses.next);

  const hasChatStarted = chatProgress > 0 || nextProgress > 0;
  const hasNextStarted = nextProgress > 0;

  const introComposerRevealProgress = hasChatStarted
    ? 1
    : rangeProgress(introProgress, sceneRange("introComposerReveal"));
  const introPromptFillProgress = rangeProgress(
    introProgress,
    sceneRange("introPromptFill"),
  );
  const chatDockProgress = rangeProgress(chatProgress, sceneRange("chatDock"));
  const chatPromptExitProgress = rangeProgress(
    chatProgress,
    sceneRange("chatPromptExit"),
  );
  const chatAppearProgress = rangeProgress(
    chatProgress,
    sceneRange("chatUserOnly"),
  );
  const nextComposerSettleProgress = rangeProgress(
    nextProgress,
    sceneRange("nextComposerSettle"),
  );
  const nextBackdropRevealProgress = rangeProgress(
    nextProgress,
    sceneRange("nextBackdropReveal"),
  );

  let composerWidth = "4px";
  let composerHeight = "4px";
  let composerRadius = "9999px";
  let composerPadding = "0px";
  let composerContentOpacity = 0;

  if (introProgress >= sceneEnd("introDotHold") || hasChatStarted) {
    const composerRevealProgress = hasChatStarted
      ? 1
      : clamp01(introComposerRevealProgress);

    composerWidth = widthByScale(Math.max(composerRevealProgress, 0.04));
    composerHeight = `${lerp(4, 130, composerRevealProgress).toFixed(2)}px`;
    composerRadius = `${lerp(9999, 32, composerRevealProgress).toFixed(2)}px`;
    composerPadding = `${lerp(0, 24, composerRevealProgress).toFixed(2)}px`;
    composerContentOpacity =
      hasChatStarted || introProgress >= sceneEnd("introComposerReveal")
        ? 1
        : 0;
  }

  const composerValue = COPY.helpPrompt;
  let composerValueReveal = introPromptFillProgress;

  if (hasChatStarted) {
    composerValueReveal = 1 - chatPromptExitProgress;
  }

  if (hasNextStarted) {
    composerValueReveal = 0;
  }

  let composerTopPercent = 50;
  let composerTopOffsetPx = 154;

  if (hasChatStarted) {
    composerTopPercent = lerp(50, 100, chatDockProgress);
    composerTopOffsetPx = lerp(154, -89, chatDockProgress);
  }

  if (hasNextStarted) {
    composerTopPercent = lerp(100, 50, nextComposerSettleProgress);
    composerTopOffsetPx = lerp(-89, 182, nextComposerSettleProgress);
  }

  const chatStage = resolveChatStage(chatProgress);
  const chatMessages = resolveMessageIds(chatStage.messageIds);
  const chatVisibilityBase = stepAt(chatProgress, sceneStart("chatUserOnly"));
  const chatOpacity =
    chatVisibilityBase * chatAppearProgress * (1 - nextComposerSettleProgress);
  const chatTranslateY = `${lerp(24, 0, chatAppearProgress).toFixed(2)}px`;

  const titleDockProgress = hasChatStarted ? chatDockProgress : 0;
  const titleTopPercent = lerp(50, 0, titleDockProgress);
  const titleTopOffsetPx = lerp(0, 136, titleDockProgress);
  const mainTitleTop = `calc(${titleTopPercent.toFixed(2)}% + ${titleTopOffsetPx.toFixed(2)}px)`;
  const mainTitleTransform = "translate(-50%, -50%)";
  const mainTitleOpacity = 1 - nextComposerSettleProgress;

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
      isSolutionReady: nextProgress >= sceneEnd("nextHold") - 0.001,
    },
    next: {
      backdropOpacity: nextBackdropRevealProgress,
      interactive: nextProgress >= sceneEnd("nextBackdropReveal"),
      phraseOpacity: nextBackdropRevealProgress,
      titleOpacity: nextComposerSettleProgress,
    },
    problemDefinitionLayer: {
      opacity: 1,
      translateY: "0%",
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
