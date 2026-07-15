import { useState } from "react";

import type { ProjectStepSummary } from "@/entities";

export const useProjectDetailStepSelection = (
  steps: readonly ProjectStepSummary[],
) => {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const orderedSteps = [...steps].sort(
    (left, right) => left.stepOrder - right.stepOrder,
  );
  const selectableSteps = orderedSteps.filter(
    (step) => step.status !== "PENDING",
  );
  const selectedStep =
    selectableSteps.find((step) => step.stepId === selectedStepId) ??
    selectableSteps[0] ??
    null;
  const activeStep = selectedStep
    ? orderedSteps.findIndex((step) => step.stepId === selectedStep.stepId) + 1
    : 0;

  const selectStep = (stepNumber: number) => {
    const nextStep = orderedSteps[stepNumber - 1];

    if (!nextStep || nextStep.status === "PENDING") {
      return;
    }

    setSelectedStepId(nextStep.stepId);
  };

  return {
    activeStep,
    completedStepCodes: orderedSteps
      .filter((step) => step.status === "COMPLETED")
      .map((step) => step.stepCode),
    orderedStepCodes: orderedSteps.map((step) => step.stepCode),
    selectableStepCodes: selectableSteps.map((step) => step.stepCode),
    selectedStep,
    selectStep,
  };
};
