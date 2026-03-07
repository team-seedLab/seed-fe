import type { RefObject } from "react";

import { Box } from "@chakra-ui/react";

import { STORY_SECTION_VH } from "../../../constants/storySections";
import type { MainStoryState } from "../../../utils/deriveMainStoryState";

import { HelpPromptSection } from "./HelpPromptSection";
import { TimeLossSection } from "./TimeLossSection";

export type MainStorySequenceProps = {
  animatedMessageIds: ReadonlySet<string>;
  chatRef: RefObject<HTMLDivElement | null>;
  conversationRef: RefObject<HTMLDivElement | null>;
  introRef: RefObject<HTMLDivElement | null>;
  nextRef: RefObject<HTMLDivElement | null>;
  storyState: MainStoryState;
};

// Internal sticky sequence for the first main-page story section.
export const MainStorySequence = ({
  animatedMessageIds,
  chatRef,
  conversationRef,
  introRef,
  nextRef,
  storyState,
}: MainStorySequenceProps) => {
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
    </Box>
  );
};
