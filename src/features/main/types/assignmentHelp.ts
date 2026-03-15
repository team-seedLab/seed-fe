export type AssignmentHelpChatMessage = {
  content: string;
  id: string;
  role: "user" | "ai";
};

export type AssignmentHelpSectionId = "intro" | "chat" | "timeLoss";

export type AssignmentHelpSectionProgressMap = Record<
  AssignmentHelpSectionId,
  number
>;

export type PromptBoxLayoutState = {
  contentOpacity: number;
  height: { base: string; md: string };
  opacity: number;
  padding: { base: string; md: string };
  radius: string;
  topOffsetPx: number;
  topPercent: number;
  value: string;
  valueReveal: number;
  width: string;
};

export type AssignmentHelpMotionState = {
  chat: {
    opacity: number;
    translateY: string;
  };
  composer: PromptBoxLayoutState;
  flags: {
    isChatVisible: boolean;
    isSolutionReady: boolean;
  };
  timeLoss: {
    backdropOpacity: number;
    interactive: boolean;
    phraseOpacity: number;
    titleOpacity: number;
  };
  title: {
    mainOpacity: number;
    mainTop: string;
    mainTransform: string;
  };
};
