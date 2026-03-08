import { Box, Flex, Text } from "@chakra-ui/react";

import { SendIcon } from "@/shared/_assets/icons";

import { ASSIGNMENT_HELP_COPY } from "../../../../../constants";
import type { AssignmentHelpState } from "../../../../../types";

type AssignmentHelpComposerProps = {
  composer: AssignmentHelpState["composer"];
};

export const AssignmentHelpComposer = ({
  composer,
}: AssignmentHelpComposerProps) => {
  return (
    <Box
      left="50%"
      opacity={composer.opacity}
      pointerEvents="none"
      position="absolute"
      top={`calc(${composer.topPercent}% + ${composer.topOffsetPx}px)`}
      transform="translate(-50%, -50%)"
      transition="opacity 220ms ease, top 220ms ease"
      w={composer.width}
      zIndex={4}
    >
      <Box
        bg="neutral.100"
        borderRadius={composer.radius}
        h={composer.height}
        overflow="hidden"
        p={composer.padding}
        transition={[
          "height 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          "border-radius 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          "padding 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          "width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        ].join(", ")}
        w="full"
      >
        <Box opacity={composer.contentOpacity} transition="opacity 220ms ease">
          <Flex align="center" h="28px">
            <Box h="28px" position="relative" w="full">
              <Text
                color="neutral.400"
                fontSize="18px"
                fontWeight={500}
                left={0}
                letterSpacing="-0.02em"
                lineHeight="1.4"
                opacity={1 - composer.valueReveal}
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
                opacity={composer.valueReveal}
                position="absolute"
                style={{
                  clipPath: `inset(0 ${((1 - composer.valueReveal) * 100).toFixed(2)}% 0 0)`,
                  transform: `translateY(${((1 - composer.valueReveal) * 6).toFixed(2)}px)`,
                }}
                top={0}
                transition={[
                  "opacity 220ms ease",
                  "clip-path 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                  "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                ].join(", ")}
                whiteSpace="nowrap"
              >
                {composer.value}
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
  );
};
