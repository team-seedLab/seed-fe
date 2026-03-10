import { type RefObject, useEffect, useMemo, useRef } from "react";

import {
  deriveAssignmentHelpMotionState,
  getAssignmentHelpChatViewState,
} from "../utils";

import type { AssignmentHelpSectionRefs } from "./useAssignmentHelpSectionProgresses";
import { useAssignmentHelpSectionProgresses } from "./useAssignmentHelpSectionProgresses";

type UseAssignmentHelpSectionViewModelParams = {
  onSolutionReadyChange?: (isReady: boolean) => void;
};

// 과제 도와줘 섹션 화면 상태 관리
export const useAssignmentHelpSectionViewModel = ({
  onSolutionReadyChange,
}: UseAssignmentHelpSectionViewModelParams) => {
  const introRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const timeLossSceneRef = useRef<HTMLDivElement | null>(null);
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const previousChatMessageSignatureRef = useRef("");
  const sectionRefs = useMemo<AssignmentHelpSectionRefs>(() => {
    return {
      intro: introRef as RefObject<HTMLElement | null>,
      chat: chatRef as RefObject<HTMLElement | null>,
      timeLoss: timeLossSceneRef as RefObject<HTMLElement | null>,
    };
  }, []);
  const sectionProgresses = useAssignmentHelpSectionProgresses(sectionRefs);
  const assignmentHelpMotionState = useMemo(() => {
    return deriveAssignmentHelpMotionState(sectionProgresses);
  }, [sectionProgresses]);
  const chatViewState = useMemo(() => {
    return getAssignmentHelpChatViewState(sectionProgresses.chat);
  }, [sectionProgresses.chat]);

  useEffect(() => {
    const conversation = conversationRef.current;

    if (!conversation) {
      previousChatMessageSignatureRef.current =
        chatViewState.chatMessageSignature;
      return;
    }

    if (
      chatViewState.chatMessageSignature !==
      previousChatMessageSignatureRef.current
    ) {
      conversation.scrollTo({
        behavior: previousChatMessageSignatureRef.current ? "smooth" : "auto",
        top: conversation.scrollHeight,
      });
    }

    previousChatMessageSignatureRef.current =
      chatViewState.chatMessageSignature;
  }, [chatViewState.chatMessageSignature]);

  useEffect(() => {
    onSolutionReadyChange?.(assignmentHelpMotionState.flags.isSolutionReady);
  }, [assignmentHelpMotionState.flags.isSolutionReady, onSolutionReadyChange]);

  return {
    activeChatPhase: chatViewState.activeChatPhase,
    activeChatPhaseKey: chatViewState.activeChatPhaseKey,
    assignmentHelpMotionState,
    chatRef,
    conversationRef,
    introRef,
    timeLossSceneRef,
    visibleChatMessages: chatViewState.visibleChatMessages,
  };
};
