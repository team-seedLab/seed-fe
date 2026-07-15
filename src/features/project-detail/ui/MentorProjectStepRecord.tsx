import { Flex, Text, VStack } from "@chakra-ui/react";

import {
  type MentorProjectStepDetail,
  ProjectStepResultCard,
  PromptCard,
} from "@/entities";
import { useClipboardCopy } from "@/shared";

type Props = {
  step: MentorProjectStepDetail;
};

export const MentorProjectStepRecord = ({ step }: Props) => {
  const { copied: copiedPrompt, copy: copyPrompt } = useClipboardCopy();
  const { copied: copiedResult, copy: copyResult } = useClipboardCopy();
  const promptSectionTitle = step.stepName.endsWith("프롬프트")
    ? step.stepName
    : `${step.stepName} 프롬프트`;

  return (
    <VStack align="flex-start" gap={{ base: 8, md: 12 }} w="full">
      <VStack align="flex-start" gap={{ base: 4, md: 6 }} w="full">
        <VStack align="flex-start" gap={{ base: 2, md: 3 }} w="full">
          <Text color="seed" fontSize="xs" fontWeight="bold">
            Step {step.stepOrder}
          </Text>
          <Text
            as="h2"
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
            멘티가 사용한 프롬프트와 수정 내용을 확인할 수 있습니다.
          </Text>
        </VStack>

        {step.prompt ? (
          <PromptCard
            content={step.prompt.finalPrompt}
            contentVariant="document"
            copied={copiedPrompt}
            label="수정 내용"
            mode="comparison"
            originalContent={step.prompt.providedPromptSnapshot}
            onCopy={() => {
              void copyPrompt(step.prompt?.finalPrompt ?? "");
            }}
          />
        ) : (
          <Flex
            align="center"
            bg="neutral.50"
            border="1px solid"
            borderColor="neutral.100"
            borderRadius="xl"
            color="neutral.600"
            justify="center"
            minH={40}
            px={5}
            w="full"
          >
            등록된 프롬프트가 없습니다.
          </Flex>
        )}
      </VStack>

      <ProjectStepResultCard
        content={step.result?.contentMarkdown ?? ""}
        copied={copiedResult}
        onCopy={() => {
          void copyResult(step.result?.contentMarkdown ?? "");
        }}
      />
    </VStack>
  );
};
