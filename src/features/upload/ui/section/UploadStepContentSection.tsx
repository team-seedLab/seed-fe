import { useState } from "react";

import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";

import { PromptCard } from "@/entities";
import { useClipboardCopy } from "@/shared";
import { ArrowRightIcon } from "@/shared/_assets/icons";

import { UploadStepResultInput } from "../../components";
import {
  useUploadStepData,
  useUploadStepProject,
  useUploadStepSubmission,
} from "../../hooks";

type Props = {
  projectId: string;
  stepNum: number;
};

export const UploadStepContentSection = ({ projectId, stepNum }: Props) => {
  const [resultTextByStep, setResultTextByStep] = useState<
    Record<string, string>
  >({});
  const { copied: copiedPrompt, copy: copyPrompt } = useClipboardCopy();
  const { copied: copiedFormat, copy: copyFormat } = useClipboardCopy();
  const { stepCode, isLastStep } = useUploadStepProject({ projectId, stepNum });
  const { stepData, isStepLoading } = useUploadStepData({
    projectId,
    stepCode,
  });
  const { isSubmitting, submitStepResult } = useUploadStepSubmission({
    projectId,
    stepNum,
    stepCode,
    isLastStep,
  });
  const resultTextKey = `${projectId}:${stepNum}`;
  const savedResultText =
    stepData?.stepCode === stepCode
      ? (stepData?.userSubmittedResult ?? "")
      : "";
  const resultText = resultTextByStep[resultTextKey] ?? savedResultText;
  const handleResultTextChange = (value: string) => {
    setResultTextByStep((prev) => ({
      ...prev,
      [resultTextKey]: value,
    }));
  };
  const stepName = stepData?.stepName;
  const providedPromptSnapshot = stepData?.providedPromptSnapshot;
  const formatPrompt = stepData?.formatPrompt;

  return (
    <Box
      bg="white"
      border="1px solid white"
      borderRadius={{ base: "3xl", md: "4xl" }}
      boxShadow="0px 20px 60px -10px rgba(0,0,0,0.08)"
      overflow="hidden"
    >
      <VStack
        align="flex-start"
        gap={{ base: 6, md: 8 }}
        p={{ base: 4, md: 12 }}
      >
        <VStack align="flex-start" gap={{ base: 2, md: "11px" }} w="full">
          <Text color="seed" fontSize="xs" fontWeight="bold">
            Step {stepNum}
          </Text>
          <Text
            color="neutral.900"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            lineHeight="1.4"
            wordBreak="keep-all"
          >
            {stepName}
          </Text>
          <Text
            color="neutral.600"
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="regular"
            lineHeight="1.5"
            wordBreak="keep-all"
          >
            AI가 과제 주제를 분석하여 최적의 자료 조사를 위한 프롬프트를
            생성했습니다.
            <br />이 프롬프트를 사용하여 고품질의 레퍼런스를 확보하세요.
          </Text>
        </VStack>

        {isStepLoading ? (
          <Box
            bg="neutral.50"
            border="1px solid"
            borderColor="neutral.50"
            borderRadius="2xl"
            overflow="hidden"
            w="full"
          >
            <Box bg="neutral.50" p={{ base: 4, md: "28px" }}>
              <Text
                color="neutral.300"
                fontFamily="mono"
                fontSize="sm"
                lineHeight="1.4"
              >
                프롬프트를 불러오는 중...
              </Text>
            </Box>
          </Box>
        ) : providedPromptSnapshot ? (
          <PromptCard
            content={providedPromptSnapshot}
            copied={copiedPrompt}
            label="생성된 프롬프트"
            onCopy={() => {
              void copyPrompt(providedPromptSnapshot);
            }}
          />
        ) : null}

        {formatPrompt && (
          <VStack align="flex-start" gap={{ base: 4, md: 6 }} w="full">
            <Text
              color="neutral.900"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              lineHeight="1.4"
            >
              결과 추출
            </Text>
            <Text
              color="neutral.600"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="regular"
              lineHeight="1.5"
              wordBreak="keep-all"
            >
              이 프롬프트를 사용하여 ai와 함께 작업한 결과를 추출해주세요.
            </Text>
            <PromptCard
              content={formatPrompt}
              copied={copiedFormat}
              label="작업 결과 추출 프롬프트"
              onCopy={() => {
                void copyFormat(formatPrompt);
              }}
            />
          </VStack>
        )}

        <UploadStepResultInput
          value={resultText}
          onChange={handleResultTextChange}
        />

        <Flex
          justify={{ base: "stretch", md: "flex-end" }}
          pt={{ base: 2, md: 8 }}
          w="full"
        >
          <Button
            bg="seed"
            borderRadius="xl"
            color="white"
            disabled={!resultText.trim() || isSubmitting}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="bold"
            gap={1}
            h={{ base: 12, md: "auto" }}
            onClick={() => {
              void submitStepResult(resultText);
            }}
            px={{ base: 6, md: 10 }}
            py={{ base: 3, md: 4 }}
            w={{ base: "full", md: "auto" }}
            _disabled={{ opacity: 0.5 }}
            _hover={{
              opacity: resultText.trim() && !isSubmitting ? 0.85 : 0.5,
            }}
          >
            {isLastStep ? "로드맵 완성" : "다음 단계로 진행"}
            <ArrowRightIcon boxSize={3} />
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};
