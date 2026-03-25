import { useCallback } from "react";
import { useNavigate } from "react-router";

import { ROUTE_PATHS } from "@/shared";

type Params = {
  projectId: string;
  stepNum: number;
};

type Result = {
  goToPrevStep: () => void;
};

export const useUploadStepNavigation = ({
  projectId,
  stepNum,
}: Params): Result => {
  const navigate = useNavigate();

  const goToPrevStep = useCallback(() => {
    if (stepNum <= 1) {
      navigate(ROUTE_PATHS.FILE_UPLOAD);
      return;
    }

    navigate(`${ROUTE_PATHS.UPLOAD_STEP_BASE}/${projectId}/${stepNum - 1}`);
  }, [navigate, projectId, stepNum]);

  return { goToPrevStep };
};
