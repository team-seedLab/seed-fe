import type { RefObject } from "react";

import { Box, VStack } from "@chakra-ui/react";

import type { MainStoryState } from "../../../../../model/deriveMainStoryState";
import { PromptMessage } from "../common/promptMessage/ui/PromptMessage";

type HelpPromptConversationProps = {
  animatedMessageIds: ReadonlySet<string>;
  chat: MainStoryState["chat"];
  conversationRef: RefObject<HTMLDivElement | null>;
  isChatVisible: boolean;
};

// Shows the staged chat transcript and keeps the scrollable conversation viewport isolated.
// 단계별 채팅 목록과 스크롤 영역만 담당하는 대화 블록
export const HelpPromptConversation = ({
  animatedMessageIds,
  chat,
  conversationRef,
  isChatVisible,
}: HelpPromptConversationProps) => {
  return (
    <Box
      inset={0}
      opacity={chat.opacity}
      pointerEvents={isChatVisible ? "auto" : "none"}
      position="absolute"
      pt={{ base: "240px", lg: "240px" }}
      transform={`translateY(${chat.translateY})`}
      transition="opacity 220ms ease, transform 220ms ease"
      zIndex={1}
    >
      <Box h="full" minH={0} pb="158px">
        <Box h="full" overflowY="auto" pr={2} ref={conversationRef}>
          <VStack align="stretch" gap={10} pb={2}>
            {chat.messages.map((message) => {
              return (
                <PromptMessage
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
