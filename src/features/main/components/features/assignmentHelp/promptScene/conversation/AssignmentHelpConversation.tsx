import type { RefObject } from "react";

import { Box, VStack } from "@chakra-ui/react";

import type { AssignmentHelpState } from "../../../../../types";

import { AssignmentHelpMessage } from "./message";

type AssignmentHelpConversationProps = {
  animatedMessageIds: ReadonlySet<string>;
  chat: AssignmentHelpState["chat"];
  conversationRef: RefObject<HTMLDivElement | null>;
  isChatVisible: boolean;
};

export const AssignmentHelpConversation = ({
  animatedMessageIds,
  chat,
  conversationRef,
  isChatVisible,
}: AssignmentHelpConversationProps) => {
  return (
    <Box
      inset={0}
      opacity={chat.opacity}
      pointerEvents={isChatVisible ? "auto" : "none"}
      position="absolute"
      pt={{ base: "240px", lg: "240px" }}
      px={10}
      transform={`translateY(${chat.translateY})`}
      transition="opacity 220ms ease, transform 220ms ease"
      zIndex={1}
    >
      <Box h="full" minH={0} pb="158px">
        <Box h="full" overflowY="auto" pr={2} ref={conversationRef}>
          <VStack align="stretch" gap={10} pb={2}>
            {chat.messages.map((message) => {
              return (
                <AssignmentHelpMessage
                  key={message.id}
                  message={message}
                  shouldAnimateEntry={animatedMessageIds.has(message.id)}
                />
              );
            })}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};
