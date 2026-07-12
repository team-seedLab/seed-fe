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
  steps: string[];
  stepCode: string | undefined;
  isLastStep: boolean;
  completedStepCodes: string[];
  selectableStepCodes: string[];
};

export const useUploadStepProject = ({
  projectId,
  stepNum,
}: Params): Result => {
  const { data: project } = useGetProjectDetail(projectId);
  const roadmapType = project?.roadmapType;
  const steps = roadmapType ? ROADMAP_STEP_CODES[roadmapType] : [];
  const stepCode = steps[stepNum - 1];
  const isLastStep = steps.length > 0 && stepNum >= steps.length;
  const stepResponses = project?.stepResponses ?? [];
  const { completedStepCodes, selectableStepCodes } = getUploadStepProgress({
    stepCodes: steps,
    stepResponses,
  });

  return {
    project,
    steps,
    stepCode,
    isLastStep,
    completedStepCodes,
    selectableStepCodes,
  };
};
