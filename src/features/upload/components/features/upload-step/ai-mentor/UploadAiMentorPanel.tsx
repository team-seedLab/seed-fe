import { Flex, IconButton, Text } from "@chakra-ui/react";

import type { ProjectStepAiMessage } from "@/entities";
import { XMarkIcon } from "@/shared";

import { UploadAiMentorComposer } from "./UploadAiMentorComposer";
import { UploadAiMentorConversation } from "./UploadAiMentorConversation";

type Props = {
  draft: string;
  hasPromptChanges: boolean;
  isError: boolean;
  isLoading: boolean;
  isSending: boolean;
  messages: ProjectStepAiMessage[];
  pendingContent: string | null;
  onChangeDraft: (content: string) => void;
  onClose: () => void;
  onEditPrompt: () => void;
  onReask: () => void;
  onRetry: () => void;
  onSend: () => void;
};

export const UploadAiMentorPanel = ({
  draft,
  hasPromptChanges,
  isError,
  isLoading,
  isSending,
  messages,
  pendingContent,
  onChangeDraft,
  onClose,
  onEditPrompt,
  onReask,
  onRetry,
  onSend,
}: Props) => {
  return (
    <Flex
      align="stretch"
      bg="white"
      border="1px solid"
      borderColor="neutral.100"
      borderRadius="3xl"
      direction="column"
      gap={6}
      h="full"
      minH={0}
      overflow="hidden"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 10 }}
      w="full"
    >
      <Flex align="center" flexShrink={0} justify="space-between">
        <Text
          color="neutral.900"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          wordBreak="keep-all"
        >
          AI 멘토와 대화하기
        </Text>
        <IconButton
          aria-label="AI 멘토 닫기"
          borderRadius="full"
          boxSize={8}
          minW={8}
          onClick={onClose}
          variant="ghost"
        >
          <XMarkIcon boxSize={3} color="neutral.600" />
        </IconButton>
      </Flex>

      <UploadAiMentorConversation
        hasPromptChanges={hasPromptChanges}
        isError={isError}
        isLoading={isLoading}
        isSending={isSending}
        messages={messages}
        pendingContent={pendingContent}
        onEditPrompt={onEditPrompt}
        onReask={onReask}
        onRetry={onRetry}
      />

      <UploadAiMentorComposer
        draft={draft}
        isSending={isSending}
        onChange={onChangeDraft}
        onSend={onSend}
      />
    </Flex>
  );
};
