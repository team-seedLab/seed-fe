import { ASSIGNMENT_HELP_COPY } from "../constants/assignmentHelpStoryData";
import {
  ASSIGNMENT_HELP_STORY_SCENE_PROGRESS,
  type AssignmentHelpStorySceneId,
} from "../constants/assignmentHelpStoryTimeline";
import type {
  AssignmentHelpChatStageId,
  AssignmentHelpMessageKey,
} from "../types/assignmentHelp";

type AssignmentHelpChatStage = {
  id: AssignmentHelpChatStageId;
  messageIds: readonly AssignmentHelpMessageKey[];
  sceneId: AssignmentHelpStorySceneId | null;
  subtitle: string;
  subtitleKey: string;
};

const sceneStart = (sceneId: AssignmentHelpStorySceneId) => {
  return ASSIGNMENT_HELP_STORY_SCENE_PROGRESS[sceneId].start;
};

const ASSIGNMENT_HELP_CHAT_STAGES: readonly AssignmentHelpChatStage[] = [
  {
    id: "empty",
    messageIds: [],
    sceneId: null,
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.common,
    subtitleKey: "empty",
  },
  {
    id: "userOnly",
    messageIds: ["userHelp"],
    sceneId: "chatUserOnly",
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.common,
    subtitleKey: "userOnly",
  },
  {
    id: "helpAndMethod",
    messageIds: ["userHelp", "aiMethod"],
    sceneId: "chatHelpAndMethod",
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.methodology,
    subtitleKey: "helpAndMethod",
  },
  {
    id: "needInfo",
    messageIds: ["userHelp", "aiNeedInfo"],
    sceneId: "chatNeedInfo",
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.tooManyInfo,
    subtitleKey: "needInfo",
  },
  {
    id: "userCrown",
    messageIds: ["userCrown"],
    sceneId: "chatUserCrown",
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.hallucination,
    subtitleKey: "userCrown",
  },
  {
    id: "hallucination",
    messageIds: ["userCrown", "aiHallucination"],
    sceneId: "chatHallucination",
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.hallucination,
    subtitleKey: "hallucination",
  },
  {
    id: "correction",
    messageIds: ["userCrown", "aiHallucination", "userCorrection"],
    sceneId: "chatCorrection",
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
    sceneId: "chatGaslight",
    subtitle: ASSIGNMENT_HELP_COPY.subtitles.repeatMistake,
    subtitleKey: "gaslight",
  },
] as const;

export const resolveAssignmentHelpChatStage = (chatProgress: number) => {
  let activeStage = ASSIGNMENT_HELP_CHAT_STAGES[0];

  for (const candidate of ASSIGNMENT_HELP_CHAT_STAGES.slice(1)) {
    if (candidate.sceneId && chatProgress >= sceneStart(candidate.sceneId)) {
      activeStage = candidate;
    }
  }

  return activeStage;
};
