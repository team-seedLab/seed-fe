import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { useQueryClient } from "@tanstack/react-query";

import { completeProjectAPI, projectKeys, saveStepResultAPI } from "@/entities";
import { DYNAMIC_ROUTE_PATHS, getApiErrorMessage, toaster } from "@/shared";

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
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const activeStepKey = `${projectId}:${stepNum}`;
  const activeStepVisitRef = useRef(0);

  useEffect(() => {
    activeStepVisitRef.current += 1;

    return () => {
      activeStepVisitRef.current += 1;
    };
  }, [activeStepKey]);

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

      const submissionStepVisit = activeStepVisitRef.current;

      setIsSaving(true);

      try {
        await saveStepResultAPI({ projectId, stepCode, resultText });

        if (isLastStep) {
          setIsCompleting(true);

          try {
            await completeProjectAPI(projectId);
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: projectKeys.detail(projectId),
              }),
              queryClient.invalidateQueries({
                queryKey: projectKeys.lists(),
                refetchType: "all",
              }),
            ]);

            if (activeStepVisitRef.current === submissionStepVisit) {
              navigate(DYNAMIC_ROUTE_PATHS.UPLOAD_COMPLETE(projectId));
            }
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

        await queryClient.invalidateQueries({
          queryKey: projectKeys.detail(projectId),
        });

        if (activeStepVisitRef.current === submissionStepVisit) {
          navigate(DYNAMIC_ROUTE_PATHS.UPLOAD_STEP(projectId, stepNum + 1));
        }
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
      queryClient,
      stepCode,
      stepNum,
    ],
  );

  return {
    isSubmitting: isSaving || isCompleting,
    submitStepResult,
  };
};
