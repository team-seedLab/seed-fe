import { type RefObject, useRef } from "react";

import type { AssignmentHelpState } from "../../../../types/assignmentHelp";

import { useAssignmentHelpAnimatedMessageIds } from "./useAssignmentHelpAnimatedMessageIds";
import { useAssignmentHelpConversationScroll } from "./useAssignmentHelpConversationScroll";

type UseAssignmentHelpPromptSceneStateParams = {
  chat: AssignmentHelpState["chat"];
};

type AssignmentHelpPromptSceneState = {
  animatedMessageIds: ReadonlySet<string>;
  conversationRef: RefObject<HTMLDivElement | null>;
};

export const useAssignmentHelpPromptSceneState = ({
  chat,
}: UseAssignmentHelpPromptSceneStateParams): AssignmentHelpPromptSceneState => {
  const conversationRef = useRef<HTMLDivElement | null>(null);

  const animatedMessageIds = useAssignmentHelpAnimatedMessageIds({
    chatStageKey: chat.stageId,
    messageIds: chat.messageIds,
    messages: chat.messages,
  });

  useAssignmentHelpConversationScroll({
    conversationRef,
    stageKey: chat.stageId,
  });

  return {
    animatedMessageIds,
    conversationRef,
  };
};
