export type AssignmentHelpRichBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "ordered-list";
      items: string[];
    };

export type AssignmentHelpChatMessage = {
  content: string | AssignmentHelpRichBlock[];
  id: string;
  role: "user" | "ai";
};

export type AssignmentHelpMessageKey =
  | "userHelp"
  | "aiMethod"
  | "aiNeedInfo"
  | "userCrown"
  | "aiHallucination"
  | "userCorrection"
  | "aiGaslight";

export type AssignmentHelpSectionId = "intro" | "chat" | "timeLoss";

export type AssignmentHelpSectionProgressMap = Record<
  AssignmentHelpSectionId,
  number
>;

export type AssignmentHelpChatStageId =
  | "empty"
  | "userOnly"
  | "helpAndMethod"
  | "needInfo"
  | "userCrown"
  | "hallucination"
  | "correction"
  | "gaslight";

export type AssignmentHelpComposerLayoutState = {
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

export type AssignmentHelpState = {
  chat: {
    messageIds: readonly AssignmentHelpMessageKey[];
    messages: AssignmentHelpChatMessage[];
    opacity: number;
    stageId: AssignmentHelpChatStageId;
    subtitle: string;
    translateY: string;
  };
  composer: AssignmentHelpComposerLayoutState;
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
    subtitle: string;
    subtitleKey: string;
  };
};
