import {
  type ProjectDetailResponse,
  ROADMAP_STEP_CODES,
  useGetProjectDetail,
} from "@/entities";

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
  const completedStepCodes = steps.filter((code) =>
    stepResponses.some(
      (step) =>
        step.stepCode === code && Boolean(step.userSubmittedResult?.trim()),
    ),
  );
  const availableStepCode = steps.find(
    (code) => !completedStepCodes.includes(code),
  );
  const selectableStepCodes = availableStepCode
    ? [...completedStepCodes, availableStepCode]
    : completedStepCodes;

  return {
    project,
    steps,
    stepCode,
    isLastStep,
    completedStepCodes,
    selectableStepCodes,
  };
};
