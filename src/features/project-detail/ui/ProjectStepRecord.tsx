import { Text, VStack } from "@chakra-ui/react";

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
  const { copied: copiedOriginal, copy: copyOriginal } = useClipboardCopy();
  const { copied: copiedEdited, copy: copyEdited } = useClipboardCopy();
  const { copied: copiedResult, copy: copyResult } = useClipboardCopy();

  if (isLoading) {
    return null;
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

  const hasEditedPrompt =
    prompt.editedPrompt != null &&
    prompt.editedPrompt !== prompt.providedPromptSnapshot;

  return (
    <VStack align="flex-start" gap={{ base: 4, md: 6 }} w="full">
      <VStack align="flex-start" gap={{ base: 2, md: 2.5 }} w="full">
        <Text color="seed" fontSize="xs" fontWeight="bold">
          Step {stepNumber}
        </Text>
        <Text
          color="neutral.900"
          fontSize={{ base: "xl", md: "26px" }}
          fontWeight="bold"
          lineHeight="1.4"
        >
          {prompt.stepName}
        </Text>
      </VStack>

      {hasEditedPrompt ? (
        <>
          <PromptCard
            content={prompt.providedPromptSnapshot}
            copied={copiedOriginal}
            label="원본 프롬프트"
            onCopy={() => {
              void copyOriginal(prompt.providedPromptSnapshot);
            }}
          />
          <PromptCard
            content={prompt.finalPrompt}
            copied={copiedEdited}
            label="최종 프롬프트"
            mode="comparison"
            originalContent={prompt.providedPromptSnapshot}
            onCopy={() => {
              void copyEdited(prompt.finalPrompt);
            }}
          />
        </>
      ) : (
        <PromptCard
          content={prompt.providedPromptSnapshot}
          copied={copiedOriginal}
          label="생성된 프롬프트"
          onCopy={() => {
            void copyOriginal(prompt.providedPromptSnapshot);
          }}
        />
      )}

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
