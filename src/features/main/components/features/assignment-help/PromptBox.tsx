import { Box, Flex, Text } from "@chakra-ui/react";

import { SendIcon } from "@/shared/_assets/icons";

import type { PromptBoxLayoutState } from "../../../types";

type PromptBoxProps = {
  composer: PromptBoxLayoutState;
};

export const PromptBox = ({ composer }: PromptBoxProps) => {
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
        bg="container.bg.card"
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
          <Flex align="center" h={7}>
            <Box h={7} position="relative" w="full">
              <Text
                color="text.secondary"
                fontSize="lg"
                fontWeight="medium"
                left={0}
                letterSpacing="-0.02em"
                lineHeight="1.4"
                opacity={1 - composer.valueReveal}
                position="absolute"
                top={0}
                transition="opacity 220ms ease"
                whiteSpace="nowrap"
              >
                AI에게 물어보기
              </Text>
              <Text
                color="text"
                fontSize="lg"
                fontWeight="medium"
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
              color="text"
              fontSize="3xl"
              fontWeight="regular"
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
