import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Flex } from "@chakra-ui/react";

import {
  UploadStepContentSection,
  UploadStepHeaderSection,
  useUploadStepActions,
  useUploadStepData,
  useUploadStepProject,
} from "@/features";
import { ROUTE_PATHS } from "@/shared";

export default function UploadStepPage() {
  const navigate = useNavigate();
  const { projectId, step } = useParams<{
    projectId: string;
    step: string;
  }>();
  const stepNum = parseInt(step ?? "1", 10);
  const isInvalidRoute = !projectId || isNaN(stepNum) || stepNum < 1;
  const resolvedProjectId = projectId ?? "";
  const resolvedStepNum = isNaN(stepNum) ? 1 : stepNum;
  const [resultTextByStep, setResultTextByStep] = useState<
    Record<string, string>
  >({});
  const { project, steps, stepCode, isLastStep } = useUploadStepProject({
    projectId: resolvedProjectId,
    stepNum: resolvedStepNum,
  });
  const { stepData, isStepLoading } = useUploadStepData({
    projectId: resolvedProjectId,
    stepCode,
  });
  const { isSubmitting, goToPrevStep, submitStepResult } = useUploadStepActions(
    {
      projectId: resolvedProjectId,
      stepNum: resolvedStepNum,
      stepCode,
      isLastStep,
    },
  );
  const resultTextKey = `${resolvedProjectId}:${resolvedStepNum}`;
  const savedResultText =
    stepData?.stepCode === stepCode ? (stepData.userSubmittedResult ?? "") : "";
  const resultText = resultTextByStep[resultTextKey] ?? savedResultText;
  const handleResultTextChange = (value: string) => {
    setResultTextByStep((prev) => ({
      ...prev,
      [resultTextKey]: value,
    }));
  };

  useEffect(() => {
    if (isInvalidRoute) {
      navigate(ROUTE_PATHS.FILE_UPLOAD, { replace: true });
    }
  }, [isInvalidRoute, navigate]);

  if (isInvalidRoute) {
    return null;
  }

  return (
    <Flex bg="white" direction="column" minH="100vh" pb="127px" pt="80px">
      <Flex direction="column" gap={10} mx="auto" px={6} w="full" maxW="896px">
        <UploadStepHeaderSection
          onGoBack={goToPrevStep}
          projectTitle={project?.title}
          roadmapType={project?.roadmapType}
          stepNum={resolvedStepNum}
          steps={steps}
        />

        <UploadStepContentSection
          formatPrompt={stepData?.formatPrompt}
          isLastStep={isLastStep}
          isStepLoading={isStepLoading}
          isSubmitting={isSubmitting}
          onResultTextChange={handleResultTextChange}
          onSubmit={() => {
            void submitStepResult(resultText);
          }}
          providedPromptSnapshot={stepData?.providedPromptSnapshot}
          resultText={resultText}
          stepName={stepData?.stepName}
          stepNum={resolvedStepNum}
        />
      </Flex>
    </Flex>
  );
}
