import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { useGetProjectDetail } from "@/entities";
import { DYNAMIC_ROUTE_PATHS } from "@/shared";

type Params = {
  projectId: string;
  stepNum: number;
  enabled: boolean;
};

type Result = {
  isResolved: boolean;
};

export const useUploadStepResumeRedirect = ({
  projectId,
  stepNum,
  enabled,
}: Params): Result => {
  const navigate = useNavigate();
  const shouldResolveResume = enabled && stepNum === 1;
  const { data: project, isLoading } = useGetProjectDetail(
    enabled ? projectId : "",
  );

  const targetStep = useMemo(() => {
    if (!shouldResolveResume || !project) {
      return null;
    }

    const stepResponses = project.stepResponses ?? [];

    if (stepResponses.length === 0) {
      return stepNum;
    }

    const nextStepIndex = stepResponses.findIndex(
      (step) => !step.userSubmittedResult,
    );

    return nextStepIndex === -1 ? stepResponses.length : nextStepIndex + 1;
  }, [project, shouldResolveResume, stepNum]);

  useEffect(() => {
    if (!projectId || targetStep === null || targetStep === stepNum) {
      return;
    }

    navigate(DYNAMIC_ROUTE_PATHS.UPLOAD_STEP(projectId, targetStep), {
      replace: true,
    });
  }, [navigate, projectId, stepNum, targetStep]);

  if (!shouldResolveResume) {
    return { isResolved: true };
  }

  if (isLoading) {
    return { isResolved: false };
  }

  return {
    isResolved: !project || targetStep === null || targetStep === stepNum,
  };
};
