import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import { SparklesIcon } from "@/shared";

import { splitAiMentorAnswer } from "../../../../utils";

import { UploadAiMentorMarkdown } from "./UploadAiMentorMarkdown";

type Props = {
  content: string;
  hasPromptChanges: boolean;
  isLatest: boolean;
  isSending: boolean;
  onEditPrompt: () => void;
  onReask: () => void;
};

export const UploadAiMentorAssistantMessage = ({
  content,
  hasPromptChanges,
  isLatest,
  isSending,
  onEditPrompt,
  onReask,
}: Props) => {
  const { answer, guide } = splitAiMentorAnswer(content);

  return (
    <Flex align="flex-start" gap={4} w="full">
      <Flex align="center" boxSize={9} flexShrink={0} justify="center">
        <SparklesIcon boxSize={5} color="seed" />
      </Flex>

      <VStack align="stretch" flex={1} gap={5} minW={0}>
        <Box spaceY={2}>
          <Text color="neutral.900" fontSize="xl" fontWeight="semibold">
            핵심 답변
          </Text>
          <UploadAiMentorMarkdown content={answer} />
        </Box>

        {guide && (
          <Box spaceY={2}>
            <Text color="neutral.900" fontSize="xl" fontWeight="semibold">
              프롬프트 개선 가이드
            </Text>
            <UploadAiMentorMarkdown content={guide} />
          </Box>
        )}

        {isLatest && (
          <HStack align="stretch" flexWrap="wrap" gap={7} pt={2}>
            <Button
              aria-label="프롬프트 수정하기"
              bg="seed"
              borderRadius="xl"
              color="white"
              flex="1 1 180px"
              fontSize="sm"
              fontWeight="semibold"
              h={10}
              maxW="205px"
              onClick={onEditPrompt}
              _hover={{ opacity: 0.85 }}
            >
              ← 프롬프트 수정하기
            </Button>
            <Button
              bg="seed"
              borderRadius="xl"
              color="white"
              disabled={!hasPromptChanges || isSending}
              flex="1 1 180px"
              fontSize="sm"
              fontWeight="semibold"
              h={10}
              maxW="205px"
              onClick={onReask}
              _disabled={{ bg: "neutral.50", color: "neutral.200" }}
              _hover={{ opacity: 0.85 }}
            >
              수정한 프롬프트로 다시 묻기
            </Button>
          </HStack>
        )}
      </VStack>
    </Flex>
  );
};
