import type { KeyboardEvent } from "react";

import { Flex, IconButton, Text, Textarea } from "@chakra-ui/react";

import { SendIcon } from "@/shared";

import { AI_MENTOR_QUESTION_MAX_LENGTH } from "../../../../constants";

type Props = {
  draft: string;
  isSending: boolean;
  onChange: (content: string) => void;
  onSend: () => void;
};

export const UploadAiMentorComposer = ({
  draft,
  isSending,
  onChange,
  onSend,
}: Props) => {
  const isSendDisabled = isSending || draft.trim().length === 0;

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();

    if (!isSendDisabled) {
      onSend();
    }
  };

  return (
    <Flex
      bg="neutral.50"
      borderRadius="xl"
      flexShrink={0}
      minH="95px"
      p={3}
      position="relative"
      w="full"
    >
      <Textarea
        aria-label="AI 멘토에게 질문하기"
        autoresize
        bg="transparent"
        border="none"
        color="neutral.900"
        disabled={isSending}
        fontSize="sm"
        maxH="360px"
        maxLength={AI_MENTOR_QUESTION_MAX_LENGTH}
        minH={0}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        p={0}
        pb={10}
        pr={10}
        placeholder="프롬프트를 입력해주세요..."
        value={draft}
        _focusVisible={{ boxShadow: "none", outline: "none" }}
      />
      <Text
        bottom={3}
        color="neutral.400"
        fontSize="2xs"
        left={3}
        position="absolute"
      >
        {draft.length}/{AI_MENTOR_QUESTION_MAX_LENGTH}
      </Text>
      <IconButton
        aria-label="질문 보내기"
        bg="seed"
        borderRadius="full"
        bottom={3}
        boxSize={9}
        disabled={isSendDisabled}
        minW={9}
        onClick={onSend}
        position="absolute"
        right={3}
        _disabled={{ bg: "neutral.200", cursor: "not-allowed" }}
        _hover={{ opacity: 0.85 }}
      >
        <SendIcon boxSize={4} color="white" />
      </IconButton>
    </Flex>
  );
};
