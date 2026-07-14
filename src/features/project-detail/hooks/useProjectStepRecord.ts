import { useGetProjectStepPrompt, useGetProjectStepResult } from "@/entities";

type Params = {
  projectId: string;
  stepCode: string;
};

export const useProjectStepRecord = ({ projectId, stepCode }: Params) => {
  const promptQuery = useGetProjectStepPrompt(projectId, stepCode);
  const resultQuery = useGetProjectStepResult(projectId, stepCode);

  return {
    prompt: promptQuery.data,
    result: resultQuery.data,
    isError: promptQuery.isError || resultQuery.isError,
    isLoading: promptQuery.isLoading || resultQuery.isLoading,
  };
};
