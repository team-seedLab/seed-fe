import { DYNAMIC_ROUTE_PATHS, ROUTE_PATHS } from "@/shared";

import { useUploadStepProject } from "./useUploadStepProject";
import { useUploadStepResumeRedirect } from "./useUploadStepResumeRedirect";

type Params = {
  projectId?: string;
  shouldResume: boolean;
  stepNum: number;
};

type Result = {
  isReady: boolean;
  redirectTo: string | null;
};

export const useUploadStepRouteGuard = ({
  projectId,
  shouldResume,
  stepNum,
}: Params): Result => {
  const normalizedProjectId = projectId ?? "";
  const isValidStepNum = Number.isInteger(stepNum) && stepNum > 0;
  const { progressStep, project, selectableStepCodes, stepCode, steps } =
    useUploadStepProject({
      projectId: normalizedProjectId,
      stepNum,
    });
  const isStepOutOfRange = steps.length > 0 && stepNum > steps.length;
  const isStepUnavailable =
    stepCode !== undefined && !selectableStepCodes.includes(stepCode);
  const isCompletedProject = project?.status === "COMPLETED";
  const { isResolved } = useUploadStepResumeRedirect({
    projectId: normalizedProjectId,
    stepNum,
    enabled:
      Boolean(projectId) &&
      isValidStepNum &&
      shouldResume &&
      !isCompletedProject,
  });

  if (!projectId || !isValidStepNum || isStepOutOfRange) {
    return {
      isReady: true,
      redirectTo: ROUTE_PATHS.FILE_UPLOAD,
    };
  }

  if (isCompletedProject) {
    return {
      isReady: true,
      redirectTo: DYNAMIC_ROUTE_PATHS.PROJECT_DETAIL(projectId),
    };
  }

  if (isStepUnavailable && progressStep !== null) {
    return {
      isReady: true,
      redirectTo: DYNAMIC_ROUTE_PATHS.UPLOAD_STEP(projectId, progressStep),
    };
  }

  return {
    isReady: isResolved,
    redirectTo: null,
  };
};
