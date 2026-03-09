import { ASSIGNMENT_HELP_CHAT_PHASES } from "../constants";
import type { AssignmentHelpChatMessage } from "../types";

const ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS = 0.25;

type AssignmentHelpChatPhaseView = {
  messages: readonly AssignmentHelpChatMessage[];
  subtitle: string;
};

export type AssignmentHelpChatViewState = {
  activeChatPhase: AssignmentHelpChatPhaseView;
  activeChatPhaseKey: string;
  chatMessageSignature: string;
  visibleChatMessages: AssignmentHelpChatMessage[];
};

const EMPTY_CHAT_PHASE: AssignmentHelpChatPhaseView = {
  messages: [],
  subtitle: "",
};

export const getAssignmentHelpChatViewState = (
  chatProgress: number,
): AssignmentHelpChatViewState => {
  const normalizedChatProgress = Math.max(0, Math.min(1, chatProgress));
  const chatPhaseStep =
    ASSIGNMENT_HELP_CHAT_PHASES.length > 0
      ? (1 - ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS) /
        ASSIGNMENT_HELP_CHAT_PHASES.length
      : 1;
  const activeChatPhaseIndex =
    normalizedChatProgress < ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS
      ? 0
      : Math.min(
          ASSIGNMENT_HELP_CHAT_PHASES.length - 1,
          Math.floor(
            (normalizedChatProgress -
              ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS) /
              chatPhaseStep,
          ),
        );
  const activeChatPhase =
    ASSIGNMENT_HELP_CHAT_PHASES[activeChatPhaseIndex] ?? EMPTY_CHAT_PHASE;
  const activeChatPhaseKey = `${Math.max(activeChatPhaseIndex, 0)}-${activeChatPhase.subtitle}`;

  if (normalizedChatProgress < ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS) {
    return {
      activeChatPhase,
      activeChatPhaseKey,
      chatMessageSignature: "",
      visibleChatMessages: activeChatPhase.messages.slice(0, 0),
    };
  }

  const phaseStartProgress =
    ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS +
    Math.max(activeChatPhaseIndex, 0) * chatPhaseStep;
  const localPhaseProgress = Math.max(
    0,
    Math.min(1, (normalizedChatProgress - phaseStartProgress) / chatPhaseStep),
  );
  const visibleMessageCount = Math.min(
    activeChatPhase.messages.length,
    1 + Math.floor(localPhaseProgress * activeChatPhase.messages.length),
  );
  const visibleChatMessages = activeChatPhase.messages.slice(
    0,
    visibleMessageCount,
  );

  return {
    activeChatPhase,
    activeChatPhaseKey,
    chatMessageSignature: visibleChatMessages
      .map((message) => {
        return message.id;
      })
      .join("|"),
    visibleChatMessages,
  };
};
