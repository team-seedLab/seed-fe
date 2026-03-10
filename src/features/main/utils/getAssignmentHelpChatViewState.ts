import {
  ASSIGNMENT_HELP_CHAT_PHASES,
  ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS,
} from "../constants";
import type { AssignmentHelpChatMessage } from "../types";

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

const getSharedPrefixMessageCount = (
  currentMessages: readonly AssignmentHelpChatMessage[],
  previousMessages: readonly AssignmentHelpChatMessage[],
) => {
  const maxSharedMessageCount = Math.min(
    currentMessages.length,
    previousMessages.length,
  );
  let sharedMessageCount = 0;

  while (
    sharedMessageCount < maxSharedMessageCount &&
    currentMessages[sharedMessageCount]?.id ===
      previousMessages[sharedMessageCount]?.id
  ) {
    sharedMessageCount += 1;
  }

  return sharedMessageCount;
};

const ASSIGNMENT_HELP_CHAT_PHASE_METAS = ASSIGNMENT_HELP_CHAT_PHASES.map(
  (phase, phaseIndex) => {
    const previousPhase = ASSIGNMENT_HELP_CHAT_PHASES[phaseIndex - 1];
    const sharedPrefixMessageCount = previousPhase
      ? getSharedPrefixMessageCount(phase.messages, previousPhase.messages)
      : 0;
    const initialVisibleMessageCount =
      sharedPrefixMessageCount > 0 ? sharedPrefixMessageCount : 1;
    const revealStepCount = Math.max(
      phase.messages.length - sharedPrefixMessageCount,
      1,
    );

    return {
      initialVisibleMessageCount: Math.min(
        initialVisibleMessageCount,
        phase.messages.length,
      ),
      phase,
      phaseIndex,
      revealStepCount,
      sharedPrefixMessageCount,
    };
  },
);

const ASSIGNMENT_HELP_CHAT_TOTAL_REVEAL_STEP_COUNT =
  ASSIGNMENT_HELP_CHAT_PHASE_METAS.reduce((count, phaseMeta) => {
    return count + phaseMeta.revealStepCount;
  }, 0);

export const getAssignmentHelpChatViewState = (
  chatProgress: number,
): AssignmentHelpChatViewState => {
  const normalizedChatProgress = Math.max(0, Math.min(1, chatProgress));
  const chatRevealStepProgress =
    ASSIGNMENT_HELP_CHAT_TOTAL_REVEAL_STEP_COUNT > 0
      ? (1 - ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS) /
        ASSIGNMENT_HELP_CHAT_TOTAL_REVEAL_STEP_COUNT
      : 1;
  let activeChatPhaseMeta = ASSIGNMENT_HELP_CHAT_PHASE_METAS[0] ?? null;
  let activeChatPhaseStartProgress = ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS;
  let activeChatPhaseProgressSpan = chatRevealStepProgress;

  if (normalizedChatProgress >= ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS) {
    let accumulatedPhaseProgress = ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS;

    for (const phaseMeta of ASSIGNMENT_HELP_CHAT_PHASE_METAS) {
      const phaseProgressSpan =
        phaseMeta.revealStepCount * chatRevealStepProgress;
      const phaseEndProgress = accumulatedPhaseProgress + phaseProgressSpan;

      activeChatPhaseMeta = phaseMeta;
      activeChatPhaseStartProgress = accumulatedPhaseProgress;
      activeChatPhaseProgressSpan = phaseProgressSpan;

      if (
        normalizedChatProgress < phaseEndProgress ||
        phaseMeta.phaseIndex === ASSIGNMENT_HELP_CHAT_PHASE_METAS.length - 1
      ) {
        break;
      }

      accumulatedPhaseProgress = phaseEndProgress;
    }
  }

  const activeChatPhase = activeChatPhaseMeta?.phase ?? EMPTY_CHAT_PHASE;
  const activeChatPhaseKey = `${Math.max(activeChatPhaseMeta?.phaseIndex ?? 0, 0)}-${activeChatPhase.subtitle}`;

  if (normalizedChatProgress < ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS) {
    return {
      activeChatPhase,
      activeChatPhaseKey,
      chatMessageSignature: "",
      visibleChatMessages: activeChatPhase.messages.slice(0, 0),
    };
  }

  const localPhaseProgress = Math.max(
    0,
    Math.min(
      1,
      (normalizedChatProgress - activeChatPhaseStartProgress) /
        activeChatPhaseProgressSpan,
    ),
  );
  const initialVisibleMessageCount =
    activeChatPhaseMeta?.initialVisibleMessageCount ?? 0;
  const additionalRevealMessageCount = Math.max(
    activeChatPhase.messages.length - initialVisibleMessageCount,
    0,
  );
  const visibleMessageCount = Math.min(
    activeChatPhase.messages.length,
    initialVisibleMessageCount +
      Math.min(
        additionalRevealMessageCount,
        Math.floor(localPhaseProgress * (additionalRevealMessageCount + 1)),
      ),
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
