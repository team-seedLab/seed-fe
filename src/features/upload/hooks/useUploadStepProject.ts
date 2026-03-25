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

  return {
    project,
    steps,
    stepCode,
    isLastStep,
  };
};
