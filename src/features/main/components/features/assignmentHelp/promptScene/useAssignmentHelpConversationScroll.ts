import { type RefObject, useEffect, useRef } from "react";

type UseAssignmentHelpConversationScrollParams = {
  conversationRef: RefObject<HTMLDivElement | null>;
  stageKey: string;
};

// Keeps the chat viewport pinned to the latest visible message whenever the story stage changes.
export const useAssignmentHelpConversationScroll = ({
  conversationRef,
  stageKey,
}: UseAssignmentHelpConversationScrollParams) => {
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
