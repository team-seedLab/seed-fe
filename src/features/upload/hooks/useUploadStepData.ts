import { useEffect, useState } from "react";

import { type ProjectStepResponse, startStepAPI } from "@/entities";
import { getApiErrorMessage, toaster } from "@/shared";

type Params = {
  projectId: string;
  stepCode?: string;
};

type Result = {
  stepData: ProjectStepResponse | null;
  isStepLoading: boolean;
};

export const useUploadStepData = ({ projectId, stepCode }: Params): Result => {
  const [stepData, setStepData] = useState<ProjectStepResponse | null>(null);
  const [isStepLoading, setIsStepLoading] = useState(false);

  useEffect(() => {
    if (!projectId || !stepCode) {
      setStepData(null);
      return;
    }

    let cancelled = false;

    const fetchStep = async () => {
      setIsStepLoading(true);
      setStepData(null);

      try {
        const data = await startStepAPI({ projectId, stepCode });

        if (!cancelled) {
          setStepData(data);
        }
      } catch (error) {
        if (!cancelled) {
          toaster.create({
            type: "error",
            description: getApiErrorMessage(error),
          });
        }
      } finally {
        if (!cancelled) {
          setIsStepLoading(false);
        }
      }
    };

    void fetchStep();

    return () => {
      cancelled = true;
    };
  }, [projectId, stepCode]);

  return {
    stepData,
    isStepLoading,
  };
};
