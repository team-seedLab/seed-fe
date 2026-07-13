import { DYNAMIC_ROUTE_PATHS, ROUTE_PATHS } from "@/shared";

import { useUploadStepProject } from "./useUploadStepProject";

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
  const {
    isLoading,
    progressStep,
    project,
    selectableStepCodes,
    stepCode,
    steps,
  } = useUploadStepProject({
    projectId: normalizedProjectId,
    stepNum,
  });
  const isStepOutOfRange = steps.length > 0 && stepNum > steps.length;
  const isStepUnavailable =
    stepCode !== undefined && !selectableStepCodes.includes(stepCode);
  const isCompletedProject = project?.status === "COMPLETED";
  const shouldResolveResume =
    Boolean(projectId) &&
    isValidStepNum &&
    shouldResume &&
    stepNum === 1 &&
    !isCompletedProject;

  if (!projectId || !isValidStepNum) {
    return {
      isReady: true,
      redirectTo: ROUTE_PATHS.FILE_UPLOAD,
    };
  }

  if (isLoading) {
    return {
      isReady: false,
      redirectTo: null,
    };
  }

  if (isStepOutOfRange) {
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

  if (
    shouldResolveResume &&
    progressStep !== null &&
    progressStep !== stepNum
  ) {
    return {
      isReady: true,
      redirectTo: DYNAMIC_ROUTE_PATHS.UPLOAD_STEP(projectId, progressStep),
    };
  }

  return {
    isReady: true,
    redirectTo: null,
  };
};
