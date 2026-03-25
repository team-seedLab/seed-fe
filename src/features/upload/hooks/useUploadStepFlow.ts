import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  type ProjectDetailResponse,
  type ProjectStepResponse,
  ROADMAP_STEP_CODES,
  completeProjectAPI,
  saveStepResultAPI,
  startStepAPI,
  useGetProjectDetail,
} from "@/entities";
import { ROUTE_PATHS, getApiErrorMessage, toaster } from "@/shared";

type Params = {
  projectId: string;
  stepNum: number;
};

type Result = {
  project: ProjectDetailResponse | undefined;
  steps: string[];
  stepData: ProjectStepResponse | null;
  isStepLoading: boolean;
  isSaving: boolean;
  isCompleting: boolean;
  isSubmitting: boolean;
  isLastStep: boolean;
  goToPrevStep: () => void;
  submitStepResult: (resultText: string) => Promise<void>;
};

export const useUploadStepFlow = ({ projectId, stepNum }: Params): Result => {
  const navigate = useNavigate();

  const [stepData, setStepData] = useState<ProjectStepResponse | null>(null);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const { data: project } = useGetProjectDetail(projectId);
  const roadmapType = project?.roadmapType;
  const steps = roadmapType ? ROADMAP_STEP_CODES[roadmapType] : [];
  const stepCode = steps[stepNum - 1];
  const isLastStep = steps.length > 0 && stepNum >= steps.length;

  useEffect(() => {
    if (!projectId || !stepCode) return;

    const fetchStep = async () => {
      setIsStepLoading(true);
      try {
        const data = await startStepAPI({ projectId, stepCode });
        setStepData(data);
      } catch (error) {
        toaster.create({
          type: "error",
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsStepLoading(false);
      }
    };

    void fetchStep();
  }, [projectId, stepCode]);

  const goToPrevStep = useCallback(() => {
    if (stepNum <= 1) {
      navigate(ROUTE_PATHS.FILE_UPLOAD);
      return;
    }

    navigate(`${ROUTE_PATHS.UPLOAD_STEP_BASE}/${projectId}/${stepNum - 1}`);
  }, [navigate, projectId, stepNum]);

  const submitStepResult = useCallback(
    async (resultText: string) => {
      if (
        !projectId ||
        !stepCode ||
        !resultText.trim() ||
        isSaving ||
        isCompleting
      ) {
        return;
      }

      setIsSaving(true);
      try {
        await saveStepResultAPI({ projectId, stepCode, resultText });

        if (isLastStep) {
          setIsCompleting(true);
          try {
            await completeProjectAPI(projectId);
            navigate(
              ROUTE_PATHS.UPLOAD_COMPLETE.replace(":projectId", projectId),
            );
          } catch (error) {
            toaster.create({
              type: "error",
              description: getApiErrorMessage(error),
            });
          } finally {
            setIsCompleting(false);
          }
          return;
        }

        navigate(`${ROUTE_PATHS.UPLOAD_STEP_BASE}/${projectId}/${stepNum + 1}`);
      } catch (error) {
        toaster.create({
          type: "error",
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsSaving(false);
      }
    },
    [
      isCompleting,
      isLastStep,
      isSaving,
      navigate,
      projectId,
      stepCode,
      stepNum,
    ],
  );

  return {
    project,
    steps,
    stepData,
    isStepLoading,
    isSaving,
    isCompleting,
    isSubmitting: isSaving || isCompleting,
    isLastStep,
    goToPrevStep,
    submitStepResult,
  };
};
