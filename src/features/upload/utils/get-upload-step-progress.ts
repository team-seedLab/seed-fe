import type { ProjectStepResponse } from "@/entities";

type StepResponse = Pick<
  ProjectStepResponse,
  "stepCode" | "userSubmittedResult"
>;

type Params = {
  stepCodes: readonly string[];
  stepResponses: readonly StepResponse[];
};

type Result = {
  completedStepCodes: string[];
  progressStep: number | null;
  selectableStepCodes: string[];
};

export const getUploadStepProgress = ({
  stepCodes,
  stepResponses,
}: Params): Result => {
  const completedStepCodes = stepCodes.filter((code) =>
    stepResponses.some(
      (step) =>
        step.stepCode === code && Boolean(step.userSubmittedResult?.trim()),
    ),
  );

  if (stepCodes.length === 0) {
    return {
      completedStepCodes,
      progressStep: null,
      selectableStepCodes: [],
    };
  }

  const firstIncompleteStepIndex = stepCodes.findIndex(
    (code) => !completedStepCodes.includes(code),
  );
  const progressStep =
    firstIncompleteStepIndex === -1
      ? stepCodes.length
      : firstIncompleteStepIndex + 1;
  const progressStepCode = stepCodes[progressStep - 1];
  const selectableStepCodes = stepCodes.filter(
    (code) => completedStepCodes.includes(code) || code === progressStepCode,
  );

  return {
    completedStepCodes,
    progressStep,
    selectableStepCodes,
  };
};
