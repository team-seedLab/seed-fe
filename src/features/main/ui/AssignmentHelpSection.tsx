import { Box, Text, VStack } from "@chakra-ui/react";

import { ChatMessage, PhraseCloud, PromptBox } from "../components";
import {
  ASSIGNMENT_HELP_SECTION_SCROLL_VH,
  ASSIGNMENT_HELP_STAGE_SWAP_ANIMATION,
} from "../constants";
import { useAssignmentHelpSectionViewModel } from "../hooks";

type AssignmentHelpSectionProps = {
  onSolutionReadyChange?: (isReady: boolean) => void;
};

export const AssignmentHelpSection = ({
  onSolutionReadyChange,
}: AssignmentHelpSectionProps) => {
  const {
    activeChatPhase,
    activeChatPhaseKey,
    assignmentHelpMotionState,
    chatRef,
    conversationRef,
    introRef,
    timeLossSceneRef,
    visibleChatMessages,
  } = useAssignmentHelpSectionViewModel({
    onSolutionReadyChange,
  });

  return (
    <Box position="relative" w="full">
      <Box h="100dvh" overflow="hidden" position="sticky" top={0}>
        <Box h="full" position="relative" w="full">
          <Box inset={0} position="absolute" w="full" zIndex={2}>
            <Box
              left="50%"
              opacity={assignmentHelpMotionState.title.mainOpacity}
              position="absolute"
              top={assignmentHelpMotionState.title.mainTop}
              transform={assignmentHelpMotionState.title.mainTransform}
              transition="opacity 220ms ease"
              w="full"
              zIndex={3}
            >
              <VStack align="center" gap={3}>
                <Text
                  color="text"
                  fontSize="5xl"
                  fontWeight="bold"
                  letterSpacing="-0.02em"
                  lineHeight="1.4"
                  textAlign="center"
                  whiteSpace="nowrap"
                >
                  혹시 AI에게{" "}
                  <Box as="span" color="seed">
                    '과제 도와줘'
                  </Box>
                  라고만 질문하고 계신가요?
                </Text>
                <Text
                  animation={ASSIGNMENT_HELP_STAGE_SWAP_ANIMATION}
                  color="text.secondary"
                  fontSize="2xl"
                  fontWeight="semibold"
                  key={activeChatPhaseKey}
                  letterSpacing="-0.02em"
                  lineHeight="1.4"
                  textAlign="center"
                  whiteSpace="nowrap"
                >
                  {activeChatPhase.subtitle}
                </Text>
              </VStack>
            </Box>

            <Box
              inset={0}
              opacity={assignmentHelpMotionState.chat.opacity}
              pointerEvents={
                assignmentHelpMotionState.flags.isChatVisible ? "auto" : "none"
              }
              position="absolute"
              pt={60}
              px={10}
              transform={`translateY(${assignmentHelpMotionState.chat.translateY})`}
              transition="opacity 220ms ease, transform 220ms ease"
              zIndex={1}
            >
              <Box h="full" minH={0} pb="158px">
                <Box h="full" overflowY="auto" pr={2} ref={conversationRef}>
                  <VStack align="stretch" gap={10} pb={2}>
                    {visibleChatMessages.map((message) => {
                      return (
                        <ChatMessage
                          animation={ASSIGNMENT_HELP_STAGE_SWAP_ANIMATION}
                          key={message.id}
                          message={message}
                        />
                      );
                    })}
                  </VStack>
                </Box>
              </Box>
            </Box>

            <PromptBox composer={assignmentHelpMotionState.composer} />

            <Box inset={0} pointerEvents="none" position="absolute" zIndex={5}>
              <Box
                left="50%"
                opacity={assignmentHelpMotionState.timeLoss.titleOpacity}
                position="absolute"
                top="50%"
                transform="translate(-50%, -50%)"
                transition="opacity 220ms ease"
                w="full"
                zIndex={2}
              >
                <Text
                  color="text"
                  fontSize="5xl"
                  fontWeight="bold"
                  letterSpacing="-0.02em"
                  lineHeight="1.4"
                  textAlign="center"
                  whiteSpace="nowrap"
                >
                  직접 프롬프트를 짜느라{" "}
                  <Box as="span" color="seed">
                    시간을 버리고
                  </Box>
                  <Box as="span" color="text">
                    {" "}
                    있진 않나요
                  </Box>
                  ?
                </Text>
              </Box>
            </Box>

            <PhraseCloud
              backdropOpacity={
                assignmentHelpMotionState.timeLoss.backdropOpacity
              }
              interactive={assignmentHelpMotionState.timeLoss.interactive}
              phraseOpacity={assignmentHelpMotionState.timeLoss.phraseOpacity}
            />
          </Box>
        </Box>
      </Box>

      {/* 실제 스크롤되는 영역 */}
      <Box>
        <Box
          h={`${ASSIGNMENT_HELP_SECTION_SCROLL_VH.intro}vh`}
          ref={introRef}
        />
        <Box h={`${ASSIGNMENT_HELP_SECTION_SCROLL_VH.chat}vh`} ref={chatRef} />
        <Box
          h={`${ASSIGNMENT_HELP_SECTION_SCROLL_VH.timeLoss}vh`}
          ref={timeLossSceneRef}
        />
      </Box>
    </Box>
  );
};
