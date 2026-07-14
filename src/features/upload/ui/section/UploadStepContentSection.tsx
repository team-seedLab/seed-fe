import { useState } from "react";

import { Box, Text, VStack } from "@chakra-ui/react";

import { PromptCard } from "@/entities";
import { useClipboardCopy } from "@/shared";

import {
  UploadStepResultInput,
  UploadStepSubmissionControl,
} from "../../components";
import {
  useUploadPromptEditor,
  useUploadStepData,
  useUploadStepProject,
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
  const { stepCode, isLastStep } = useUploadStepProject({ projectId, stepNum });
  const {
    promptData,
    resultData,
    isStepLoading,
    savePrompt,
    savePromptOnPageExit,
  } = useUploadStepData({
    projectId,
    stepCode,
  });
  const stepName = promptData?.stepName;
  const providedPromptSnapshot = promptData?.providedPromptSnapshot;
  const { editedPrompt, changePrompt, commitPrompt, resetPrompt } =
    useUploadPromptEditor({
      editorKey: `${projectId}:${stepNum}`,
      initialEditedPrompt: promptData?.editedPrompt,
      originalPrompt: providedPromptSnapshot ?? "",
      onSave: savePrompt,
      onSaveBeforePageExit: savePromptOnPageExit,
    });
  const resultTextKey = `${projectId}:${stepNum}`;
  const savedResultText =
    resultData && resultData.stepCode === stepCode
      ? resultData.contentMarkdown
      : "";
  const resultText = resultTextByStep[resultTextKey] ?? savedResultText;
  const handleResultTextChange = (value: string) => {
    setResultTextByStep((prev) => ({
      ...prev,
      [resultTextKey]: value,
    }));
  };
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
            content={editedPrompt}
            copied={copiedPrompt}
            label="수정 내용"
            mode="editable"
            originalContent={providedPromptSnapshot}
            onCommit={(content) => {
              void commitPrompt(content);
            }}
            onContentChange={changePrompt}
            onCopy={() => {
              void copyPrompt(editedPrompt);
            }}
            onReset={() => {
              void resetPrompt();
            }}
          />
        ) : null}

        <UploadStepResultInput
          value={resultText}
          onChange={handleResultTextChange}
        />

        <UploadStepSubmissionControl
          isLastStep={isLastStep}
          isStepLoading={isStepLoading}
          key={`${projectId}:${stepCode ?? stepNum}`}
          projectId={projectId}
          resultText={resultText}
          stepCode={stepCode}
          stepNum={stepNum}
        />
      </VStack>
    </Box>
  );
};
