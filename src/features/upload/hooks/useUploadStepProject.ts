import {
  type ProjectDetailResponse,
  ROADMAP_STEP_CODES,
  useGetProjectDetail,
} from "@/entities";

import { getUploadStepProgress } from "../utils";

type Params = {
  projectId: string;
  stepNum: number;
};

type Result = {
  project: ProjectDetailResponse | undefined;
  isLoading: boolean;
  steps: string[];
  stepCode: string | undefined;
  isLastStep: boolean;
  completedStepCodes: string[];
  progressStep: number | null;
  selectableStepCodes: string[];
};

export const useUploadStepProject = ({
  projectId,
  stepNum,
}: Params): Result => {
  const { data: project, isLoading } = useGetProjectDetail(projectId);
  const roadmapType = project?.roadmapType;
  const steps = roadmapType ? ROADMAP_STEP_CODES[roadmapType] : [];
  const stepCode = steps[stepNum - 1];
  const isLastStep = steps.length > 0 && stepNum >= steps.length;
  const stepResponses = project?.stepResponses ?? [];
  const { completedStepCodes, progressStep, selectableStepCodes } =
    getUploadStepProgress({
      stepCodes: steps,
      stepResponses,
    });

  return {
    project,
    isLoading,
    steps,
    stepCode,
    isLastStep,
    completedStepCodes,
    progressStep,
    selectableStepCodes,
  };
};
