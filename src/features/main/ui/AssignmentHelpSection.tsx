import { type RefObject, useEffect, useMemo, useRef } from "react";

import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import { SendIcon } from "@/shared/_assets/icons";

import {
  ASSIGNMENT_HELP_CHAT_PHASES,
  ASSIGNMENT_HELP_SECTION_SCROLL_VH,
  TIME_LOSS_PHRASES,
  TIME_LOSS_PHRASE_BASE_TONE,
} from "../constants";
import {
  type AssignmentHelpSectionRefs,
  useAssignmentHelpSectionProgresses,
  useTimeLossPhraseMotion,
} from "../hooks";
import {
  createFadeUpAnimation,
  deriveAssignmentHelpMotionState,
} from "../utils";

type AssignmentHelpSectionProps = {
  onSolutionReadyChange?: (isReady: boolean) => void;
};

const assignmentHelpStageSwapAnimation = createFadeUpAnimation({
  distancePx: 12,
  durationMs: 240,
});
const ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS = 0.25;

export const AssignmentHelpSection = ({
  onSolutionReadyChange,
}: AssignmentHelpSectionProps) => {
  const introRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const timeLossSceneRef = useRef<HTMLDivElement | null>(null);
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
  const {
    activeChatPhase,
    activeChatPhaseKey,
    chatMessageSignature,
    visibleChatMessages,
  } = useMemo(() => {
    const normalizedChatProgress = Math.max(
      0,
      Math.min(1, sectionProgresses.chat),
    );
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
    const nextActiveChatPhase =
      ASSIGNMENT_HELP_CHAT_PHASES[activeChatPhaseIndex];

    if (normalizedChatProgress < ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS) {
      return {
        activeChatPhase: nextActiveChatPhase,
        activeChatPhaseKey: `${activeChatPhaseIndex}-${nextActiveChatPhase.subtitle}`,
        chatMessageSignature: "",
        visibleChatMessages: nextActiveChatPhase.messages.slice(0, 0),
      };
    }

    const phaseStartProgress =
      ASSIGNMENT_HELP_CHAT_PHASE_START_PROGRESS +
      activeChatPhaseIndex * chatPhaseStep;
    const localPhaseProgress = Math.max(
      0,
      Math.min(
        1,
        (normalizedChatProgress - phaseStartProgress) / chatPhaseStep,
      ),
    );
    const visibleMessageCount = Math.min(
      nextActiveChatPhase.messages.length,
      1 + Math.floor(localPhaseProgress * nextActiveChatPhase.messages.length),
    );
    const nextVisibleChatMessages = nextActiveChatPhase.messages.slice(
      0,
      visibleMessageCount,
    );

    return {
      activeChatPhase: nextActiveChatPhase,
      activeChatPhaseKey: `${activeChatPhaseIndex}-${nextActiveChatPhase.subtitle}`,
      chatMessageSignature: nextVisibleChatMessages
        .map((message) => {
          return message.id;
        })
        .join("|"),
      visibleChatMessages: nextVisibleChatMessages,
    };
  }, [sectionProgresses.chat]);
  const isSolutionReady = assignmentHelpMotionState.flags.isSolutionReady;
  const timeLossPhraseContainerRef = useRef<HTMLDivElement | null>(null);
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const previousChatMessageSignatureRef = useRef("");

  const {
    baseOpacity: timeLossPhraseBaseOpacity,
    handlePointerLeave: handleTimeLossPhrasePointerLeave,
    handlePointerMove: handleTimeLossPhrasePointerMove,
    phraseRefs: timeLossPhraseRefs,
  } = useTimeLossPhraseMotion({
    containerRef: timeLossPhraseContainerRef,
    interactive: assignmentHelpMotionState.timeLoss.interactive,
  });

  useEffect(() => {
    const conversation = conversationRef.current;

    if (!conversation) {
      previousChatMessageSignatureRef.current = chatMessageSignature;
      return;
    }

    if (chatMessageSignature !== previousChatMessageSignatureRef.current) {
      conversation.scrollTo({
        behavior: previousChatMessageSignatureRef.current ? "smooth" : "auto",
        top: conversation.scrollHeight,
      });
    }

    previousChatMessageSignatureRef.current = chatMessageSignature;
  }, [chatMessageSignature]);

  useEffect(() => {
    onSolutionReadyChange?.(isSolutionReady);
  }, [isSolutionReady, onSolutionReadyChange]);

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
                  animation={assignmentHelpStageSwapAnimation}
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
              pt="240px"
              px={10}
              transform={`translateY(${assignmentHelpMotionState.chat.translateY})`}
              transition="opacity 220ms ease, transform 220ms ease"
              zIndex={1}
            >
              <Box h="full" minH={0} pb="158px">
                <Box h="full" overflowY="auto" pr={2} ref={conversationRef}>
                  <VStack align="stretch" gap={10} pb={2}>
                    {visibleChatMessages.map((message) => {
                      if (message.role === "user") {
                        return (
                          <Flex
                            animation={assignmentHelpStageSwapAnimation}
                            justify="flex-end"
                            key={message.id}
                            w="full"
                          >
                            <Box
                              bg="neutral.100"
                              borderRadius="24px"
                              borderTopRightRadius="6px"
                              color="text"
                              maxW="100%"
                              px={6}
                              py={4}
                            >
                              <Text
                                color="inherit"
                                fontSize="lg"
                                fontWeight="medium"
                                letterSpacing="-0.02em"
                                lineHeight="1.4"
                              >
                                {message.content}
                              </Text>
                            </Box>
                          </Flex>
                        );
                      }

                      return (
                        <HStack
                          align="start"
                          animation={assignmentHelpStageSwapAnimation}
                          gap={7}
                          key={message.id}
                          w="full"
                        >
                          <Flex
                            align="center"
                            bg="neutral.100"
                            borderRadius="full"
                            color="text"
                            flexShrink={0}
                            fontSize="3xl"
                            fontWeight="bold"
                            h={12}
                            justify="center"
                            letterSpacing="-0.02em"
                            lineHeight="1.4"
                            w={12}
                          >
                            AI
                          </Flex>
                          <Box
                            color="text"
                            fontSize="lg"
                            fontWeight="medium"
                            letterSpacing="-0.02em"
                            lineHeight="1.4"
                            maxW="575px"
                            pt={3}
                            whiteSpace="pre-line"
                          >
                            {message.content}
                          </Box>
                        </HStack>
                      );
                    })}
                  </VStack>
                </Box>
              </Box>
            </Box>

            <Box
              left="50%"
              opacity={assignmentHelpMotionState.composer.opacity}
              pointerEvents="none"
              position="absolute"
              top={`calc(${assignmentHelpMotionState.composer.topPercent}% + ${assignmentHelpMotionState.composer.topOffsetPx}px)`}
              transform="translate(-50%, -50%)"
              transition="opacity 220ms ease, top 220ms ease"
              w={assignmentHelpMotionState.composer.width}
              zIndex={4}
            >
              <Box
                bg="container.bg.card"
                borderRadius={assignmentHelpMotionState.composer.radius}
                h={assignmentHelpMotionState.composer.height}
                overflow="hidden"
                p={assignmentHelpMotionState.composer.padding}
                transition={[
                  "height 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                  "border-radius 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                  "padding 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                  "width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                ].join(", ")}
                w="full"
              >
                <Box
                  opacity={assignmentHelpMotionState.composer.contentOpacity}
                  transition="opacity 220ms ease"
                >
                  <Flex align="center" h="28px">
                    <Box h="28px" position="relative" w="full">
                      <Text
                        color="neutral.400"
                        fontSize="18px"
                        fontWeight={500}
                        left={0}
                        letterSpacing="-0.02em"
                        lineHeight="1.4"
                        opacity={
                          1 - assignmentHelpMotionState.composer.valueReveal
                        }
                        position="absolute"
                        top={0}
                        transition="opacity 220ms ease"
                        whiteSpace="nowrap"
                      >
                        AI에게 물어보기
                      </Text>
                      <Text
                        color="#191F28"
                        fontSize="18px"
                        fontWeight={500}
                        left={0}
                        letterSpacing="-0.02em"
                        lineHeight="1.4"
                        opacity={assignmentHelpMotionState.composer.valueReveal}
                        position="absolute"
                        style={{
                          clipPath: `inset(0 ${((1 - assignmentHelpMotionState.composer.valueReveal) * 100).toFixed(2)}% 0 0)`,
                          transform: `translateY(${((1 - assignmentHelpMotionState.composer.valueReveal) * 6).toFixed(2)}px)`,
                        }}
                        top={0}
                        transition={[
                          "opacity 220ms ease",
                          "clip-path 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                          "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                        ].join(", ")}
                        whiteSpace="nowrap"
                      >
                        {assignmentHelpMotionState.composer.value}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex align="center" justify="space-between" mt={3}>
                    <Text
                      color="neutral.900"
                      fontSize="30px"
                      fontWeight={300}
                      lineHeight="1.4"
                    >
                      +
                    </Text>
                    <SendIcon boxSize={6} color="neutral.900" />
                  </Flex>
                </Box>
              </Box>
            </Box>

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

            <Box
              inset={0}
              pointerEvents={
                assignmentHelpMotionState.timeLoss.interactive ? "auto" : "none"
              }
              position="absolute"
              zIndex={3}
            >
              <Box
                h="full"
                left={0}
                opacity={assignmentHelpMotionState.timeLoss.backdropOpacity}
                overflow="hidden"
                position="absolute"
                top={0}
                transition="opacity 260ms ease"
                w="full"
                zIndex={1}
              >
                <Box
                  h="full"
                  opacity={assignmentHelpMotionState.timeLoss.phraseOpacity}
                  transition="opacity 220ms ease"
                  w="full"
                >
                  <Box
                    h="full"
                    onPointerLeave={
                      assignmentHelpMotionState.timeLoss.interactive
                        ? handleTimeLossPhrasePointerLeave
                        : undefined
                    }
                    onPointerMove={
                      assignmentHelpMotionState.timeLoss.interactive
                        ? handleTimeLossPhrasePointerMove
                        : undefined
                    }
                    overflow="hidden"
                    pointerEvents={
                      assignmentHelpMotionState.timeLoss.interactive
                        ? "auto"
                        : "none"
                    }
                    position="relative"
                    ref={timeLossPhraseContainerRef}
                    style={{ contain: "layout paint style" }}
                    w="full"
                  >
                    {TIME_LOSS_PHRASES.map((phrase, index) => (
                      <Text
                        as="p"
                        color={`rgb(${TIME_LOSS_PHRASE_BASE_TONE}, ${TIME_LOSS_PHRASE_BASE_TONE}, ${TIME_LOSS_PHRASE_BASE_TONE})`}
                        fontSize={{
                          base: "18px",
                          md: "22px",
                          lg: "26px",
                          xl: "30px",
                        }}
                        fontWeight={700}
                        key={`${phrase.text}-${index}`}
                        left="50%"
                        letterSpacing="-0.02em"
                        lineHeight="1.4"
                        pointerEvents="none"
                        position="absolute"
                        ref={(el) => {
                          timeLossPhraseRefs.current[index] = el;
                        }}
                        style={{
                          opacity: timeLossPhraseBaseOpacity,
                          transform: "translate3d(-50%, -50%, 0) scale(1)",
                          transition: "none",
                          willChange: "transform, opacity, left, top",
                        }}
                        top="50%"
                        userSelect="none"
                        whiteSpace="nowrap"
                      >
                        {phrase.text}
                      </Text>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
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
