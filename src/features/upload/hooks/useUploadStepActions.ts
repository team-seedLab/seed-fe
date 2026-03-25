import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

import { completeProjectAPI, saveStepResultAPI } from "@/entities";
import { ROUTE_PATHS, getApiErrorMessage, toaster } from "@/shared";

import { useUploadStepProject } from "./useUploadStepProject";

type Params = {
  projectId: string;
  stepNum: number;
};

type Result = {
  isSubmitting: boolean;
  goToPrevStep: () => void;
  submitStepResult: (resultText: string) => Promise<void>;
};

export const useUploadStepActions = ({
  projectId,
  stepNum,
}: Params): Result => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { stepCode, isLastStep } = useUploadStepProject({ projectId, stepNum });

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
    isSubmitting: isSaving || isCompleting,
    goToPrevStep,
    submitStepResult,
  };
};
