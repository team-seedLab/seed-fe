import { ASSIGNMENT_HELP_COPY } from "../../data/assignmentHelpStoryData";
import type {
  AssignmentHelpChatStageId,
  AssignmentHelpMessageKey,
} from "../../types/assignmentHelp";

export type AssignmentHelpChatStage = {
  id: AssignmentHelpChatStageId;
  messageIds: readonly AssignmentHelpMessageKey[];
  startAt: number;
  subtitle: string;
  subtitleKey: string;
};

export const ASSIGNMENT_HELP_CHAT_STAGES: readonly AssignmentHelpChatStage[] = [
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
    startAt: 0.1429,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.common,
    subtitleKey: "userOnly",
  },
  {
    id: "helpAndMethod",
    messageIds: ["userHelp", "aiMethod"],
    startAt: 0.2619,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.methodology,
    subtitleKey: "helpAndMethod",
  },
  {
    id: "needInfo",
    messageIds: ["userHelp", "aiNeedInfo"],
    startAt: 0.381,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.tooManyInfo,
    subtitleKey: "needInfo",
  },
  {
    id: "userCrown",
    messageIds: ["userCrown"],
    startAt: 0.5,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.hallucination,
    subtitleKey: "userCrown",
  },
  {
    id: "hallucination",
    messageIds: ["userCrown", "aiHallucination"],
    startAt: 0.619,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.hallucination,
    subtitleKey: "hallucination",
  },
  {
    id: "correction",
    messageIds: ["userCrown", "aiHallucination", "userCorrection"],
    startAt: 0.7381,
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
    startAt: 0.8571,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.repeatMistake,
    subtitleKey: "gaslight",
  },
] as const;
