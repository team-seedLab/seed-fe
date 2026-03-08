import { Box, Text } from "@chakra-ui/react";

import { ASSIGNMENT_HELP_COPY } from "../../../../constants";
import type { AssignmentHelpState } from "../../../../types";

import { TimeLossPhraseCloud } from "./phraseCloud";

type TimeLossSceneProps = {
  timeLoss: AssignmentHelpState["timeLoss"];
};

export const TimeLossScene = ({ timeLoss }: TimeLossSceneProps) => {
  return (
    <>
      <Box inset={0} pointerEvents="none" position="absolute" zIndex={5}>
        <Box
          left="50%"
          opacity={timeLoss.titleOpacity}
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
        pointerEvents={timeLoss.interactive ? "auto" : "none"}
        position="absolute"
        zIndex={3}
      >
        <Box
          h="full"
          left={0}
          opacity={timeLoss.backdropOpacity}
          overflow="hidden"
          position="absolute"
          top={0}
          transition="opacity 260ms ease"
          w="full"
          zIndex={1}
        >
          <Box
            h="full"
            opacity={timeLoss.phraseOpacity}
            transition="opacity 220ms ease"
            w="full"
          >
            <TimeLossPhraseCloud interactive={timeLoss.interactive} />
          </Box>
        </Box>
      </Box>
    </>
  );
};
