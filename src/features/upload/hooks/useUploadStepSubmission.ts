import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

import { completeProjectAPI, saveStepResultAPI } from "@/entities";
import { ROUTE_PATHS, getApiErrorMessage, toaster } from "@/shared";

type Params = {
  projectId: string;
  stepNum: number;
  stepCode?: string;
  isLastStep: boolean;
};

type Result = {
  isSubmitting: boolean;
  submitStepResult: (resultText: string) => Promise<void>;
};

export const useUploadStepSubmission = ({
  projectId,
  stepNum,
  stepCode,
  isLastStep,
}: Params): Result => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

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
    submitStepResult,
  };
};
