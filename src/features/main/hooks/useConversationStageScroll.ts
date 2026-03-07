import { type RefObject, useEffect, useRef } from "react";

type UseConversationStageScrollParams = {
  conversationRef: RefObject<HTMLDivElement | null>;
  stageKey: string;
};

// Keeps the chat viewport pinned to the latest visible message whenever the story stage changes.
// 스토리 단계가 바뀔 때마다 채팅 스크롤을 최신 메시지 위치에 맞춰 유지
export const useConversationStageScroll = ({
  conversationRef,
  stageKey,
}: UseConversationStageScrollParams) => {
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
