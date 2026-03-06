import { Box, Text } from "@chakra-ui/react";

import type { MainStoryState } from "../../../model/deriveMainStoryState";
import { COPY } from "../../../model/promptStoryData";
import { ProblemDefinitionNextPhraseCloud } from "../common/problemDefinitionNextPhraseCloud";

type TimeLossSectionProps = {
  storyState: MainStoryState;
};

// Shows the "시간을 버리고 있진 않나요?" bridge scene and activates the floating phrase cloud.
// "시간을 버리고 있진 않나요?" 전환 장면과 문구 클라우드 활성화를 담당
export const TimeLossSection = ({ storyState }: TimeLossSectionProps) => {
  return (
    <>
      <Box inset={0} pointerEvents="none" position="absolute" zIndex={5}>
        <Box
          left="50%"
          opacity={storyState.next.titleOpacity}
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
            {COPY.problemDefinitionNextTitle.prefix}
            <Box as="span" color="#75AC36">
              {COPY.problemDefinitionNextTitle.highlight}
            </Box>
            <Box as="span" color="#191F28">
              {COPY.problemDefinitionNextTitle.suffix}
            </Box>
            ?
          </Text>
        </Box>
      </Box>

      <Box
        inset={0}
        pointerEvents={storyState.next.interactive ? "auto" : "none"}
        position="absolute"
        zIndex={3}
      >
        <Box
          h="full"
          left={0}
          opacity={storyState.next.backdropOpacity}
          overflow="hidden"
          position="absolute"
          top={0}
          transition="opacity 260ms ease"
          w="full"
          zIndex={1}
        >
          <Box
            h="full"
            opacity={storyState.next.phraseOpacity}
            transition="opacity 220ms ease"
            w="full"
          >
            <ProblemDefinitionNextPhraseCloud
              interactive={storyState.next.interactive}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};
