import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";

import { PromptCard } from "@/entities";
import { useClipboardCopy } from "@/shared";

import { useProjectStepRecord } from "../hooks";

type Props = {
  projectId: string;
  stepCode: string;
  stepNumber: number;
};

export const ProjectStepRecord = ({
  projectId,
  stepCode,
  stepNumber,
}: Props) => {
  const { prompt, result, isError, isLoading } = useProjectStepRecord({
    projectId,
    stepCode,
  });
  const { copied: copiedPrompt, copy: copyPrompt } = useClipboardCopy();
  const { copied: copiedResult, copy: copyResult } = useClipboardCopy();

  if (isLoading) {
    return (
      <Flex
        align="center"
        color="neutral.600"
        gap={3}
        justify="center"
        minH={40}
        w="full"
      >
        <Spinner color="seed" size="sm" />
        <Text fontSize={{ base: "sm", md: "md" }}>
          단계 기록을 불러오는 중입니다.
        </Text>
      </Flex>
    );
  }

  if (isError || !prompt) {
    return (
      <VStack align="flex-start" gap={{ base: 2, md: 2.5 }} w="full">
        <Text color="seed" fontSize="xs" fontWeight="bold">
          Step {stepNumber}
        </Text>
        <Text color="neutral.600" fontSize={{ base: "sm", md: "md" }}>
          단계 기록을 불러오지 못했습니다.
        </Text>
      </VStack>
    );
  }

  const promptSectionTitle = prompt.stepName.endsWith("프롬프트")
    ? prompt.stepName
    : `${prompt.stepName} 프롬프트`;

  return (
    <VStack align="flex-start" gap={{ base: 8, md: 12 }} w="full">
      <VStack align="flex-start" gap={{ base: 4, md: 6 }} w="full">
        <VStack align="flex-start" gap={{ base: 2, md: 3 }} w="full">
          <Text color="seed" fontSize="xs" fontWeight="bold">
            Step {stepNumber}
          </Text>
          <Text
            color="neutral.900"
            fontSize={{ base: "xl", md: "26px" }}
            fontWeight="bold"
            wordBreak="keep-all"
          >
            {promptSectionTitle}
          </Text>
          <Text
            color="neutral.600"
            fontSize={{ base: "sm", md: "md" }}
            wordBreak="keep-all"
          >
            왼쪽 프롬프트 복사 → AI에서 실행 → 오른쪽에서 수정 → 결과 기록
          </Text>
        </VStack>

        <PromptCard
          content={prompt.finalPrompt}
          contentVariant="document"
          copied={copiedPrompt}
          label="수정 내용"
          mode="comparison"
          originalContent={prompt.providedPromptSnapshot}
          onCopy={() => {
            void copyPrompt(prompt.finalPrompt);
          }}
        />
      </VStack>

      {result && (
        <PromptCard
          content={result.contentMarkdown}
          copied={copiedResult}
          label="작업 결과"
          onCopy={() => {
            void copyResult(result.contentMarkdown);
          }}
        />
      )}
    </VStack>
  );
};
