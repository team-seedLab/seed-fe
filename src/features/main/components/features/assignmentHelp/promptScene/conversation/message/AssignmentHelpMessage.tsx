import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import type {
  AssignmentHelpChatMessage,
  AssignmentHelpRichBlock,
} from "../../../../../../types";
import { createFadeUpAnimation } from "../../../../../../utils";

const assignmentHelpStageSwapAnimation = createFadeUpAnimation({
  distancePx: 12,
  durationMs: 240,
});

type AssignmentHelpMessageProps = {
  message: AssignmentHelpChatMessage;
  shouldAnimateEntry: boolean;
};

const renderMarkedText = (text: string) => {
  const parts = text.split(/(\*\*.+?\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    const isBoldToken = part.startsWith("**") && part.endsWith("**");
    if (!isBoldToken) {
      return (
        <Box as="span" key={`${part}-${index}`}>
          {part}
        </Box>
      );
    }

    return (
      <Box as="span" fontWeight={700} key={`${part}-${index}`}>
        {part.slice(2, -2)}
      </Box>
    );
  });
};

const renderRichBlocks = (blocks: AssignmentHelpRichBlock[]) => {
  return (
    <VStack align="start" gap={3}>
      {blocks.map((block, blockIndex) => {
        if (block.type === "paragraph") {
          return (
            <Text key={`paragraph-${blockIndex}`}>
              {renderMarkedText(block.text)}
            </Text>
          );
        }

        return (
          <VStack
            align="start"
            gap={1}
            key={`ordered-list-${blockIndex}`}
            pl={4}
          >
            {block.items.map((item, itemIndex) => {
              return (
                <Text key={`ordered-item-${itemIndex}`}>
                  {itemIndex + 1}. {renderMarkedText(item)}
                </Text>
              );
            })}
          </VStack>
        );
      })}
    </VStack>
  );
};

export const AssignmentHelpMessage = ({
  message,
  shouldAnimateEntry,
}: AssignmentHelpMessageProps) => {
  const entryAnimation = shouldAnimateEntry
    ? assignmentHelpStageSwapAnimation
    : undefined;

  if (message.role === "user") {
    const userText = typeof message.content === "string" ? message.content : "";

    return (
      <Flex animation={entryAnimation} justify="flex-end" w="full">
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
            {userText}
          </Text>
        </Box>
      </Flex>
    );
  }

  const aiContent =
    typeof message.content === "string" ? (
      <Text>{renderMarkedText(message.content)}</Text>
    ) : (
      renderRichBlocks(message.content)
    );

  return (
    <HStack align="start" animation={entryAnimation} gap={7} w="full">
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
      >
        {aiContent}
      </Box>
    </HStack>
  );
};
