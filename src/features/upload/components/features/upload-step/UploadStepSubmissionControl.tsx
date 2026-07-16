import { Button, Flex } from "@chakra-ui/react";

import { ArrowRightIcon } from "@/shared/_assets/icons";

import {
  useUploadStepSelfCheck,
  useUploadStepSubmission,
} from "../../../hooks";

import { UploadSelfCheckDialog } from "./UploadSelfCheckDialog";

type Props = {
  ensureResultSaved: (content: string) => Promise<boolean>;
  isLastStep: boolean;
  isStepLoading: boolean;
  projectId: string;
  resultText: string;
  stepCode?: string;
  stepNum: number;
};

export const UploadStepSubmissionControl = ({
  ensureResultSaved,
  isLastStep,
  isStepLoading,
  projectId,
  resultText,
  stepCode,
  stepNum,
}: Props) => {
  const { isSubmitting, submitStep } = useUploadStepSubmission({
    ensureResultSaved,
    projectId,
    stepNum,
    stepCode,
    isLastStep,
  });
  const {
    answers: selfCheckAnswers,
    changeAnswer: changeSelfCheckAnswer,
    checkItems: selfCheckItems,
    closeSelfCheck,
    isError: isSelfCheckError,
    isLoading: isSelfCheckLoading,
    isOpen: isSelfCheckOpen,
    isValid: isSelfCheckValid,
    openSelfCheck,
    retrySelfCheck,
  } = useUploadStepSelfCheck({ projectId, stepCode });
  const isSubmitDisabled = !resultText.trim() || isSubmitting || isStepLoading;

  return (
    <>
      <Flex
        justify={{ base: "stretch", md: "flex-end" }}
        pt={{ base: 2, md: 8 }}
        w="full"
      >
        <Button
          bg="seed"
          borderRadius="xl"
          color="white"
          disabled={isSubmitDisabled}
          fontSize={{ base: "sm", md: "md" }}
          fontWeight="bold"
          gap={1}
          h={{ base: 12, md: "auto" }}
          onClick={openSelfCheck}
          px={{ base: 6, md: 10 }}
          py={{ base: 3, md: 4 }}
          w={{ base: "full", md: "auto" }}
          _disabled={{ opacity: 0.5 }}
          _hover={{ opacity: isSubmitDisabled ? 0.5 : 0.85 }}
        >
          {isLastStep ? "로드맵 완성" : "다음 단계로 진행"}
          <ArrowRightIcon boxSize={3} />
        </Button>
      </Flex>

      <UploadSelfCheckDialog
        checkItems={selfCheckItems}
        isError={isSelfCheckError}
        isLoading={isSelfCheckLoading}
        isOpen={isSelfCheckOpen}
        isSubmitting={isSubmitting}
        isValid={isSelfCheckValid}
        onAnswerChange={changeSelfCheckAnswer}
        onOpenChange={(open) => {
          if (open) {
            openSelfCheck();
            return;
          }

          closeSelfCheck();
        }}
        onRetry={() => {
          void retrySelfCheck();
        }}
        onSubmit={() => {
          void submitStep({
            checkItems: selfCheckAnswers,
            resultText,
          });
        }}
      />
    </>
  );
};
