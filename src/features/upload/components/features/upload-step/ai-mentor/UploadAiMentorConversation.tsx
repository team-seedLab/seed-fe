import { useEffect, useRef } from "react";

import { Button, Flex, Spinner, Text, VStack } from "@chakra-ui/react";

import type { ProjectStepAiMessage } from "@/entities";
import { SeedAiIcon } from "@/shared";

import { UploadAiMentorAssistantMessage } from "./UploadAiMentorAssistantMessage";
import { UploadAiMentorUserMessage } from "./UploadAiMentorUserMessage";

const getLatestAssistantMessageId = (messages: ProjectStepAiMessage[]) => {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].sender === "ASSISTANT") {
      return messages[index].aiMessageId;
    }
  }

  return null;
};

type Props = {
  hasPromptChanges: boolean;
  isError: boolean;
  isLoading: boolean;
  isSending: boolean;
  messages: ProjectStepAiMessage[];
  pendingContent: string | null;
  onEditPrompt: () => void;
  onReask: () => void;
  onRetry: () => void;
};

export const UploadAiMentorConversation = ({
  hasPromptChanges,
  isError,
  isLoading,
  isSending,
  messages,
  pendingContent,
  onEditPrompt,
  onReask,
  onRetry,
}: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const latestAssistantMessageId = getLatestAssistantMessageId(messages);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [messages.length, pendingContent]);

  if (isLoading) {
    return (
      <Flex align="center" flex={1} justify="center">
        <Spinner color="seed" size="lg" />
      </Flex>
    );
  }

  if (isError && messages.length === 0) {
    return (
      <VStack flex={1} gap={4} justify="center" px={6} textAlign="center">
        <Text color="neutral.600" fontSize="sm">
          AI 멘토 대화를 불러오지 못했습니다.
        </Text>
        <Button borderRadius="xl" onClick={onRetry} size="sm" variant="outline">
          다시 시도
        </Button>
      </VStack>
    );
  }

  const isEmpty = messages.length === 0 && !pendingContent;

  return (
    <VStack
      align="stretch"
      flex={1}
      gap={6}
      minH={0}
      overflowY="auto"
      px={{ base: 4, md: 6 }}
      py={6}
      ref={scrollContainerRef}
    >
      {isError && (
        <Flex
          align="center"
          bg="red.50"
          borderRadius="xl"
          gap={3}
          justify="space-between"
          px={4}
          py={3}
        >
          <Text color="red.600" fontSize="xs">
            일부 대화를 불러오지 못했습니다.
          </Text>
          <Button onClick={onRetry} size="xs" variant="ghost">
            다시 시도
          </Button>
        </Flex>
      )}

      {isEmpty ? (
        <VStack flex={1} gap={4} justify="center" textAlign="center">
          <Flex
            align="center"
            bg="seed.subtle"
            borderRadius="full"
            boxSize={12}
            justify="center"
          >
            <SeedAiIcon boxSize={9} />
          </Flex>
          <VStack gap={1}>
            <Text color="neutral.900" fontSize="md" fontWeight="bold">
              AI 멘토에게 질문해 보세요
            </Text>
            <Text color="neutral.500" fontSize="sm" wordBreak="keep-all">
              현재 단계에서 막히는 부분을 자유롭게 질문할 수 있습니다.
            </Text>
          </VStack>
        </VStack>
      ) : (
        messages.map((message) =>
          message.sender === "USER" ? (
            <UploadAiMentorUserMessage
              content={message.content}
              key={message.aiMessageId}
            />
          ) : (
            <UploadAiMentorAssistantMessage
              content={message.content}
              hasPromptChanges={hasPromptChanges}
              isLatest={message.aiMessageId === latestAssistantMessageId}
              isSending={isSending}
              key={message.aiMessageId}
              onEditPrompt={onEditPrompt}
              onReask={onReask}
            />
          ),
        )
      )}

      {pendingContent && (
        <>
          <UploadAiMentorUserMessage content={pendingContent} />
          <Flex align="center" gap={3} role="status">
            <Spinner color="seed" size="sm" />
            <Text color="neutral.500" fontSize="sm">
              답변을 준비하고 있습니다.
            </Text>
          </Flex>
        </>
      )}
    </VStack>
  );
};
