import { type RefObject, useMemo, useRef } from "react";

import { deriveMainStoryState } from "../../../../../model/deriveMainStoryState";
import {
  type StorySectionRefs,
  useSectionProgresses,
} from "../../../../../model/useSectionProgresses";
import { useAnimatedChatMessageIds } from "../../animatedChatMessages/common/useAnimatedChatMessageIds";
import { useConversationStageScroll } from "../../conversationStageScroll/common/useConversationStageScroll";

// Derives the refs, scroll progress, story state, and chat animation state for the sticky story sequence.
// sticky 스토리 시퀀스에 필요한 ref, 스크롤 진행률, 상태, 채팅 애니메이션 정보를 한 번에 계산
export const useStoryScrollSequenceState = () => {
  const introRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);
  const conversationRef = useRef<HTMLDivElement | null>(null);

  const sectionRefs = useMemo<StorySectionRefs>(() => {
    return {
      intro: introRef as RefObject<HTMLElement | null>,
      chat: chatRef as RefObject<HTMLElement | null>,
      next: nextRef as RefObject<HTMLElement | null>,
    };
  }, []);

  const sectionProgresses = useSectionProgresses(sectionRefs);
  const storyState = useMemo(() => {
    return deriveMainStoryState(sectionProgresses);
  }, [sectionProgresses]);
  const chatStageKey = storyState.chat.stageId;
  const animatedMessageIds = useAnimatedChatMessageIds({
    chatStageKey,
    messageIds: storyState.chat.messageIds,
    messages: storyState.chat.messages,
  });

  useConversationStageScroll({
    conversationRef,
    stageKey: chatStageKey,
  });

  return {
    animatedMessageIds,
    conversationRef,
    introRef,
    isSolutionActivated: storyState.flags.isSolutionReady,
    nextRef,
    chatRef,
    storyState,
  };
};
