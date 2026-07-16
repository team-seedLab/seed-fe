import { Box, Text, VStack } from "@chakra-ui/react";

import {
  type ProjectStepPrompt,
  ProjectStepResultCard,
  PromptCard,
} from "@/entities";
import { useClipboardCopy } from "@/shared";

import { UploadStepSubmissionControl } from "../../components";
import type {
  UploadPromptEditorState,
  UploadStepResultEditorState,
} from "../../hooks";

type Props = {
  editorFocusRequestId: number | null;
  isLastStep: boolean;
  isStepLoading: boolean;
  promptData: ProjectStepPrompt | undefined;
  promptEditor: UploadPromptEditorState;
  projectId: string;
  resultEditor: UploadStepResultEditorState;
  stepCode: string | undefined;
  stepNum: number;
};

export const UploadStepContentSection = ({
  editorFocusRequestId,
  isLastStep,
  isStepLoading,
  promptData,
  promptEditor,
  projectId,
  resultEditor,
  stepCode,
  stepNum,
}: Props) => {
  const { copied: copiedPrompt, copy: copyPrompt } = useClipboardCopy();
  const stepName = promptData?.stepName;
  const providedPromptSnapshot = promptData?.providedPromptSnapshot;
  const { editedPrompt, changePrompt, commitPrompt, resetPrompt } =
    promptEditor;
  const { resultText, changeResult, commitResult, ensureResultSaved } =
    resultEditor;
  return (
    <Box bg="white" border="1px solid white">
      <VStack align="flex-start" gap={{ base: 6, md: 8 }}>
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
            editorFocusRequestId={editorFocusRequestId}
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

        <ProjectStepResultCard
          content={resultText}
          mode="editable"
          onCommit={(content) => {
            void commitResult(content);
          }}
          onContentChange={changeResult}
        />

        <UploadStepSubmissionControl
          ensureResultSaved={ensureResultSaved}
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
