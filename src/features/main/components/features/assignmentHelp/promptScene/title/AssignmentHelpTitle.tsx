import { Box, Text, VStack } from "@chakra-ui/react";

import { ASSIGNMENT_HELP_COPY } from "../../../../../constants";
import type { AssignmentHelpState } from "../../../../../types";
import { createFadeUpAnimation } from "../../../../../utils";

const assignmentHelpStageSwapAnimation = createFadeUpAnimation({
  distancePx: 12,
  durationMs: 240,
});

type AssignmentHelpTitleProps = {
  title: AssignmentHelpState["title"];
};

export const AssignmentHelpTitle = ({ title }: AssignmentHelpTitleProps) => {
  return (
    <Box
      left="50%"
      opacity={title.mainOpacity}
      position="absolute"
      top={title.mainTop}
      transform={title.mainTransform}
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
          key={title.subtitleKey}
          letterSpacing="-0.02em"
          lineHeight="1.4"
          textAlign="center"
          whiteSpace="nowrap"
        >
          {title.subtitle}
        </Text>
      </VStack>
    </Box>
  );
};
