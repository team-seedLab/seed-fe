import { useCallback } from "react";
import { useNavigate } from "react-router";

import { DYNAMIC_ROUTE_PATHS } from "@/shared";

type Params = {
  projectId: string;
  stepNum: number;
};

type Result = {
  goToStep: (step: number) => void;
};

export const useUploadStepNavigation = ({
  projectId,
  stepNum,
}: Params): Result => {
  const navigate = useNavigate();

  const goToStep = useCallback(
    (step: number) => {
      if (!Number.isInteger(step) || step <= 0 || step === stepNum) {
        return;
      }

      navigate(DYNAMIC_ROUTE_PATHS.UPLOAD_STEP(projectId, step));
    },
    [navigate, projectId, stepNum],
  );

  return { goToStep };
};
