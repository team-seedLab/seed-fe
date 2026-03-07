import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  AssignmentHelpChatMessage,
  AssignmentHelpMessageKey,
  AssignmentHelpState,
} from "../../../../types/assignmentHelp";

type UseAssignmentHelpPromptSceneStateParams = {
  chat: AssignmentHelpState["chat"];
};

type AssignmentHelpPromptSceneState = {
  animatedMessageIds: ReadonlySet<string>;
  conversationRef: RefObject<HTMLDivElement | null>;
};

type AnimatedMessageIdsState = readonly AssignmentHelpMessageKey[];

const useAnimatedMessageIds = ({
  chatStageKey,
  messageIds,
  messages,
}: {
  chatStageKey: string;
  messageIds: readonly AssignmentHelpMessageKey[];
  messages: AssignmentHelpChatMessage[];
}) => {
  const previousMessageIdsRef = useRef<readonly AssignmentHelpMessageKey[]>([]);
  const [animatedMessageIds, setAnimatedMessageIds] =
    useState<AnimatedMessageIdsState>([]);

  useLayoutEffect(() => {
    const previousMessageIds = previousMessageIdsRef.current;
    const nextAnimatedMessageIds = messageIds.filter((messageId) => {
      return !previousMessageIds.includes(messageId);
    });

    setAnimatedMessageIds(nextAnimatedMessageIds);
    previousMessageIdsRef.current = messageIds;
  }, [chatStageKey, messageIds]);

  return useMemo(() => {
    return new Set(
      messages
        .filter((_, index) => {
          const messageId = messageIds[index];
          return messageId ? animatedMessageIds.includes(messageId) : false;
        })
        .map((message) => {
          return message.id;
        }),
    );
  }, [animatedMessageIds, messageIds, messages]);
};

const useConversationScroll = ({
  conversationRef,
  stageKey,
}: {
  conversationRef: RefObject<HTMLDivElement | null>;
  stageKey: string;
}) => {
  const previousStageKeyRef = useRef("");

  useEffect(() => {
    const conversation = conversationRef.current;

    if (!conversation) {
      previousStageKeyRef.current = stageKey;
      return;
    }

    if (stageKey !== previousStageKeyRef.current) {
      conversation.scrollTo({
        behavior: previousStageKeyRef.current ? "smooth" : "auto",
        top: conversation.scrollHeight,
      });
    }

    previousStageKeyRef.current = stageKey;
  }, [conversationRef, stageKey]);
};

export const useAssignmentHelpPromptSceneState = ({
  chat,
}: UseAssignmentHelpPromptSceneStateParams): AssignmentHelpPromptSceneState => {
  const conversationRef = useRef<HTMLDivElement | null>(null);

  const animatedMessageIds = useAnimatedMessageIds({
    chatStageKey: chat.stageId,
    messageIds: chat.messageIds,
    messages: chat.messages,
  });

  useConversationScroll({
    conversationRef,
    stageKey: chat.stageId,
  });

  return {
    animatedMessageIds,
    conversationRef,
  };
};
