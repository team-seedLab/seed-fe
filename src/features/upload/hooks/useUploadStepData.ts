import {
  type ProjectStepPrompt,
  type ProjectStepResult,
  useGetOrCreateProjectStepPrompt,
  useGetProjectStepResult,
  useUpdateProjectStepPrompt,
} from "@/entities";

type Params = {
  projectId: string;
  stepCode?: string;
};

type Result = {
  promptData: ProjectStepPrompt | undefined;
  resultData: ProjectStepResult | null | undefined;
  isStepLoading: boolean;
  savePrompt: (editedPrompt: string) => Promise<void>;
};

export const useUploadStepData = ({ projectId, stepCode }: Params): Result => {
  const normalizedStepCode = stepCode ?? "";
  const promptQuery = useGetOrCreateProjectStepPrompt(
    projectId,
    normalizedStepCode,
  );
  const resultQuery = useGetProjectStepResult(projectId, normalizedStepCode);
  const updatePromptMutation = useUpdateProjectStepPrompt();

  const savePrompt = async (editedPrompt: string) => {
    if (!projectId || !stepCode) {
      return;
    }

    await updatePromptMutation.mutateAsync({
      projectId,
      stepCode,
      editedPrompt,
    });
  };

  return {
    promptData: promptQuery.data,
    resultData: resultQuery.data,
    isStepLoading: promptQuery.isLoading || resultQuery.isLoading,
    savePrompt,
  };
};
