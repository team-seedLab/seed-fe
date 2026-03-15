import { Box, Flex, HStack, Text } from "@chakra-ui/react";

import type { AssignmentHelpChatMessage as AssignmentHelpChatMessageData } from "../../../types";

type AssignmentHelpChatMessageProps = {
  animation: string;
  message: AssignmentHelpChatMessageData;
};

export const ChatMessage = ({
  animation,
  message,
}: AssignmentHelpChatMessageProps) => {
  if (message.role === "user") {
    return (
      <Flex animation={animation} justify="flex-end" w="full">
        <Box
          bg="neutral.100"
          borderRadius="3xl"
          borderTopRightRadius="md"
          color="text"
          px={{ base: 4, md: 6 }}
          py={{ base: 2, md: 4 }}
        >
          <Text
            color="inherit"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="medium"
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
      animation={animation}
      gap={{ base: 2, md: 7 }}
      w="full"
    >
      <Flex
        align="center"
        bg="neutral.100"
        borderRadius="full"
        color="text"
        flexShrink={0}
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        justify="center"
        lineHeight="1.4"
        boxSize={{ base: 10, md: 12 }}
      >
        AI
      </Flex>
      <Box
        color="text"
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="medium"
        lineHeight="1.4"
        maxW="575px"
        pt={3}
        whiteSpace="pre-line"
        wordBreak="keep-all"
      >
        {message.content}
      </Box>
    </HStack>
  );
};
