import { type RefObject, useEffect, useMemo, useRef } from "react";

import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import { SendIcon } from "@/shared/_assets/icons";

import {
  ASSIGNMENT_HELP_COPY,
  ASSIGNMENT_HELP_SECTION_SCROLL_VH,
  TIME_LOSS_PHRASES,
  TIME_LOSS_PHRASE_BASE_TONE,
} from "../constants";
import {
  type AssignmentHelpSectionRefs,
  useAssignmentHelpPromptSceneState,
  useAssignmentHelpSectionProgresses,
  useTimeLossPhraseMotion,
} from "../hooks";
import { createFadeUpAnimation, deriveAssignmentHelpState } from "../utils";

type AssignmentHelpSectionProps = {
  onSolutionReadyChange?: (isReady: boolean) => void;
};

const assignmentHelpStageSwapAnimation = createFadeUpAnimation({
  distancePx: 12,
  durationMs: 240,
});

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
  const assignmentHelpState = useMemo(() => {
    return deriveAssignmentHelpState(sectionProgresses);
  }, [sectionProgresses]);
  const isSolutionReady = assignmentHelpState.flags.isSolutionReady;
  const timeLossPhraseContainerRef = useRef<HTMLDivElement | null>(null);
  const { animatedMessageIds, conversationRef } =
    useAssignmentHelpPromptSceneState({
      chat: assignmentHelpState.chat,
    });
  const {
    baseOpacity: timeLossPhraseBaseOpacity,
    handlePointerLeave: handleTimeLossPhrasePointerLeave,
    handlePointerMove: handleTimeLossPhrasePointerMove,
    phraseRefs: timeLossPhraseRefs,
  } = useTimeLossPhraseMotion({
    containerRef: timeLossPhraseContainerRef,
    interactive: assignmentHelpState.timeLoss.interactive,
  });

  useEffect(() => {
    onSolutionReadyChange?.(isSolutionReady);
  }, [isSolutionReady, onSolutionReadyChange]);

  return (
    <Box position="relative" w="full">
      <Box position="relative" w="full">
        <Box
          h="calc(100dvh - {sizes.headerHeight})"
          overflow="hidden"
          position="sticky"
          top={0}
        >
          <Box h="full" position="relative" w="full">
            <Box inset={0} position="absolute" w="full" zIndex={2}>
              <Box
                left="50%"
                opacity={assignmentHelpState.title.mainOpacity}
                position="absolute"
                top={assignmentHelpState.title.mainTop}
                transform={assignmentHelpState.title.mainTransform}
                transition="opacity 220ms ease"
                w="full"
                zIndex={3}
              >
                <VStack align="center" gap={6}>
                  <Text
                    color="neutral.900"
                    fontSize="48px"
                    fontWeight={700}
                    letterSpacing="-0.02em"
                    lineHeight="1.4"
                    textAlign="center"
                    whiteSpace="nowrap"
                  >
                    {ASSIGNMENT_HELP_COPY.title.prefix}
                    <Box as="span" color="#75AC36">
                      {ASSIGNMENT_HELP_COPY.title.highlight}
                    </Box>
                    {ASSIGNMENT_HELP_COPY.title.suffix}
                  </Text>
                  <Text
                    animation={assignmentHelpStageSwapAnimation}
                    color="neutral.600"
                    fontSize="20px"
                    fontWeight={500}
                    key={assignmentHelpState.title.subtitle}
                    letterSpacing="-0.02em"
                    lineHeight="1.4"
                    textAlign="center"
                    whiteSpace="nowrap"
                  >
                    {assignmentHelpState.title.subtitle}
                  </Text>
                </VStack>
              </Box>

              <Box
                inset={0}
                opacity={assignmentHelpState.chat.opacity}
                pointerEvents={
                  assignmentHelpState.flags.isChatVisible ? "auto" : "none"
                }
                position="absolute"
                pt={{ base: "240px", lg: "240px" }}
                px={10}
                transform={`translateY(${assignmentHelpState.chat.translateY})`}
                transition="opacity 220ms ease, transform 220ms ease"
                zIndex={1}
              >
                <Box h="full" minH={0} pb="158px">
                  <Box h="full" overflowY="auto" pr={2} ref={conversationRef}>
                    <VStack align="stretch" gap={10} pb={2}>
                      {assignmentHelpState.chat.messages.map((message) => {
                        const entryAnimation = animatedMessageIds.has(
                          message.id,
                        )
                          ? assignmentHelpStageSwapAnimation
                          : undefined;

                        if (message.role === "user") {
                          return (
                            <Flex
                              animation={entryAnimation}
                              justify="flex-end"
                              key={message.id}
                              w="full"
                            >
                              <Box
                                bg="neutral.100"
                                borderRadius="24px"
                                borderTopRightRadius="6px"
                                color="#191F28"
                                maxW="100%"
                                px={6}
                                py={4}
                              >
                                <Text
                                  color="inherit"
                                  fontSize="18px"
                                  fontWeight={500}
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
                            animation={entryAnimation}
                            gap={7}
                            key={message.id}
                            w="full"
                          >
                            <Flex
                              align="center"
                              bg="neutral.100"
                              borderRadius="full"
                              color="#191F28"
                              flexShrink={0}
                              fontSize="30px"
                              fontWeight={700}
                              h={12}
                              justify="center"
                              letterSpacing="-0.02em"
                              lineHeight="1.4"
                              w={12}
                            >
                              AI
                            </Flex>
                            <Box
                              color="#191F28"
                              fontSize="18px"
                              fontWeight={500}
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
                opacity={assignmentHelpState.composer.opacity}
                pointerEvents="none"
                position="absolute"
                top={`calc(${assignmentHelpState.composer.topPercent}% + ${assignmentHelpState.composer.topOffsetPx}px)`}
                transform="translate(-50%, -50%)"
                transition="opacity 220ms ease, top 220ms ease"
                w={assignmentHelpState.composer.width}
                zIndex={4}
              >
                <Box
                  bg="neutral.100"
                  borderRadius={assignmentHelpState.composer.radius}
                  h={assignmentHelpState.composer.height}
                  overflow="hidden"
                  p={assignmentHelpState.composer.padding}
                  transition={[
                    "height 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                    "border-radius 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                    "padding 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                    "width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                  ].join(", ")}
                  w="full"
                >
                  <Box
                    opacity={assignmentHelpState.composer.contentOpacity}
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
                          opacity={1 - assignmentHelpState.composer.valueReveal}
                          position="absolute"
                          top={0}
                          transition="opacity 220ms ease"
                          whiteSpace="nowrap"
                        >
                          {ASSIGNMENT_HELP_COPY.placeholder}
                        </Text>
                        <Text
                          color="#191F28"
                          fontSize="18px"
                          fontWeight={500}
                          left={0}
                          letterSpacing="-0.02em"
                          lineHeight="1.4"
                          opacity={assignmentHelpState.composer.valueReveal}
                          position="absolute"
                          style={{
                            clipPath: `inset(0 ${((1 - assignmentHelpState.composer.valueReveal) * 100).toFixed(2)}% 0 0)`,
                            transform: `translateY(${((1 - assignmentHelpState.composer.valueReveal) * 6).toFixed(2)}px)`,
                          }}
                          top={0}
                          transition={[
                            "opacity 220ms ease",
                            "clip-path 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                            "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                          ].join(", ")}
                          whiteSpace="nowrap"
                        >
                          {assignmentHelpState.composer.value}
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

              <Box
                inset={0}
                pointerEvents="none"
                position="absolute"
                zIndex={5}
              >
                <Box
                  left="50%"
                  opacity={assignmentHelpState.timeLoss.titleOpacity}
                  position="absolute"
                  top="50%"
                  transform="translate(-50%, -50%)"
                  transition="opacity 220ms ease"
                  w="full"
                  zIndex={2}
                >
                  <Text
                    color="neutral.900"
                    fontSize="48px"
                    fontWeight={700}
                    letterSpacing="-0.02em"
                    lineHeight="1.4"
                    textAlign="center"
                    whiteSpace="nowrap"
                  >
                    {ASSIGNMENT_HELP_COPY.timeLossTitle.prefix}
                    <Box as="span" color="#75AC36">
                      {ASSIGNMENT_HELP_COPY.timeLossTitle.highlight}
                    </Box>
                    <Box as="span" color="#191F28">
                      {ASSIGNMENT_HELP_COPY.timeLossTitle.suffix}
                    </Box>
                    ?
                  </Text>
                </Box>
              </Box>

              <Box
                inset={0}
                pointerEvents={
                  assignmentHelpState.timeLoss.interactive ? "auto" : "none"
                }
                position="absolute"
                zIndex={3}
              >
                <Box
                  h="full"
                  left={0}
                  opacity={assignmentHelpState.timeLoss.backdropOpacity}
                  overflow="hidden"
                  position="absolute"
                  top={0}
                  transition="opacity 260ms ease"
                  w="full"
                  zIndex={1}
                >
                  <Box
                    h="full"
                    opacity={assignmentHelpState.timeLoss.phraseOpacity}
                    transition="opacity 220ms ease"
                    w="full"
                  >
                    <Box
                      h="full"
                      onPointerLeave={
                        assignmentHelpState.timeLoss.interactive
                          ? handleTimeLossPhrasePointerLeave
                          : undefined
                      }
                      onPointerMove={
                        assignmentHelpState.timeLoss.interactive
                          ? handleTimeLossPhrasePointerMove
                          : undefined
                      }
                      overflow="hidden"
                      pointerEvents={
                        assignmentHelpState.timeLoss.interactive
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

        <Box>
          <Box
            h={`${ASSIGNMENT_HELP_SECTION_SCROLL_VH.intro}vh`}
            ref={introRef}
          />
          <Box
            h={`${ASSIGNMENT_HELP_SECTION_SCROLL_VH.chat}vh`}
            ref={chatRef}
          />
          <Box
            h={`${ASSIGNMENT_HELP_SECTION_SCROLL_VH.timeLoss}vh`}
            ref={timeLossSceneRef}
          />
        </Box>
      </Box>
    </Box>
  );
};
