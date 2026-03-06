import { Box } from "@chakra-ui/react";

import { STORY_SECTION_VH } from "../../../model/storySections";
import { HelpPromptSection } from "../../preSolutionSection";
import { TimeLossSection } from "../../problemDefinitionNextSection";
import { PromptNoHesitationSection } from "../../promptNoHesitationSection";
import { ExecutionOnlySection } from "../../solutionSection";
import { WhatToDoSection } from "../../whatToDoSection";
import { useStoryScrollSequenceState } from "../common/storyScrollSequenceState";

// Main landing page orchestrator that stitches the sticky story and post-story sections together.
// 메인 랜딩의 sticky 스토리와 후속 섹션을 직접 조립하는 진입 컴포넌트
export const PromptScrollSequence = () => {
  const {
    animatedMessageIds,
    chatRef,
    conversationRef,
    introRef,
    isSolutionActivated,
    nextRef,
    storyState,
  } = useStoryScrollSequenceState();

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
            <Box
              inset={0}
              opacity={storyState.problemDefinitionLayer.opacity}
              position="absolute"
              transform={`translateY(${storyState.problemDefinitionLayer.translateY})`}
              transition="opacity 220ms ease, transform 340ms ease"
              w="full"
              zIndex={2}
            >
              <HelpPromptSection
                animatedMessageIds={animatedMessageIds}
                conversationRef={conversationRef}
                storyState={storyState}
              />
              <TimeLossSection storyState={storyState} />
            </Box>
          </Box>
        </Box>

        <Box>
          <Box h={`${STORY_SECTION_VH.intro}vh`} ref={introRef} />
          <Box h={`${STORY_SECTION_VH.chat}vh`} ref={chatRef} />
          <Box h={`${STORY_SECTION_VH.next}vh`} ref={nextRef} />
        </Box>
      </Box>

      <Box w="full">
        <ExecutionOnlySection isActivated={isSolutionActivated} />
        <PromptNoHesitationSection />
        <WhatToDoSection />
      </Box>
    </Box>
  );
};
