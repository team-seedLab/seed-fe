import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Flex } from "@chakra-ui/react";

import {
  UploadStepContentSection,
  UploadStepHeaderSection,
  useUploadStepFlow,
} from "@/features";
import { ROUTE_PATHS, useClipboardCopy } from "@/shared";

function UploadStepContent({
  projectId,
  stepNum,
}: {
  projectId: string;
  stepNum: number;
}) {
  const [resultText, setResultText] = useState("");
  const { copied: copiedPrompt, copy: copyPrompt } = useClipboardCopy();
  const { copied: copiedFormat, copy: copyFormat } = useClipboardCopy();
  const {
    project,
    steps,
    stepData,
    isStepLoading,
    isSubmitting,
    isLastStep,
    goToPrevStep,
    submitStepResult,
  } = useUploadStepFlow({ projectId, stepNum });

  return (
    <Flex bg="white" direction="column" minH="100vh" pb="127px" pt="80px">
      <Flex direction="column" gap={10} mx="auto" px={6} w="full" maxW="896px">
        <UploadStepHeaderSection
          onGoBack={goToPrevStep}
          projectTitle={project?.title}
          roadmapType={project?.roadmapType}
          stepNum={stepNum}
          steps={steps}
        />

        <UploadStepContentSection
          copiedFormat={copiedFormat}
          copiedPrompt={copiedPrompt}
          formatPrompt={stepData?.formatPrompt}
          isLastStep={isLastStep}
          isStepLoading={isStepLoading}
          isSubmitting={isSubmitting}
          onFormatCopy={() => {
            if (!stepData?.formatPrompt) return;
            void copyFormat(stepData.formatPrompt);
          }}
          onPromptCopy={() => {
            if (!stepData?.providedPromptSnapshot) return;
            void copyPrompt(stepData.providedPromptSnapshot);
          }}
          onResultTextChange={setResultText}
          onSubmit={() => {
            void submitStepResult(resultText);
          }}
          providedPromptSnapshot={stepData?.providedPromptSnapshot}
          resultText={resultText}
          stepName={stepData?.stepName}
          stepNum={stepNum}
        />
      </Flex>
    </Flex>
  );
}

export default function UploadStepPage() {
  const navigate = useNavigate();
  const { projectId, step } = useParams<{
    projectId: string;
    step: string;
  }>();
  const stepNum = parseInt(step ?? "1", 10);

  useEffect(() => {
    if (!projectId || isNaN(stepNum) || stepNum < 1) {
      navigate(ROUTE_PATHS.FILE_UPLOAD, { replace: true });
    }
  }, [projectId, stepNum, navigate]);

  if (!projectId || isNaN(stepNum) || stepNum < 1) {
    return null;
  }

  return (
    <UploadStepContent
      key={`${projectId}-${stepNum}`}
      projectId={projectId}
      stepNum={stepNum}
    />
  );
}
