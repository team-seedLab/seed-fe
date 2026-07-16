import {
  type ProjectStepPrompt,
  type ProjectStepResult,
  saveProjectStepResultOnPageExitAPI,
  updateProjectStepPromptOnPageExitAPI,
  useGetOrCreateProjectStepPrompt,
  useGetProjectStepResult,
  useSaveProjectStepResult,
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
  savePrompt: (editedPrompt: string, signal?: AbortSignal) => Promise<void>;
  savePromptOnPageExit: (editedPrompt: string) => void;
  saveResult: (content: string, signal?: AbortSignal) => Promise<void>;
  saveResultOnPageExit: (content: string) => void;
};

export const useUploadStepData = ({ projectId, stepCode }: Params): Result => {
  const normalizedStepCode = stepCode ?? "";
  const promptQuery = useGetOrCreateProjectStepPrompt(
    projectId,
    normalizedStepCode,
  );
  const resultQuery = useGetProjectStepResult(projectId, normalizedStepCode);
  const updatePromptMutation = useUpdateProjectStepPrompt();
  const saveResultMutation = useSaveProjectStepResult();

  const savePrompt = async (editedPrompt: string, signal?: AbortSignal) => {
    if (!projectId || !stepCode) {
      return;
    }

    await updatePromptMutation.mutateAsync({
      projectId,
      stepCode,
      editedPrompt,
      ...(signal && { signal }),
    });
  };

  const savePromptOnPageExit = (editedPrompt: string) => {
    if (!projectId || !stepCode) {
      return;
    }

    void updateProjectStepPromptOnPageExitAPI({
      projectId,
      stepCode,
      editedPrompt,
    });
  };

  const saveResult = async (contentMarkdown: string, signal?: AbortSignal) => {
    if (!projectId || !stepCode) {
      return;
    }

    await saveResultMutation.mutateAsync({
      projectId,
      stepCode,
      contentMarkdown,
      ...(signal && { signal }),
    });
  };

  const saveResultOnPageExit = (contentMarkdown: string) => {
    if (!projectId || !stepCode) {
      return;
    }

    void saveProjectStepResultOnPageExitAPI({
      projectId,
      stepCode,
      contentMarkdown,
    });
  };

  return {
    promptData: promptQuery.data,
    resultData: resultQuery.data,
    isStepLoading: promptQuery.isLoading || resultQuery.isLoading,
    savePrompt,
    savePromptOnPageExit,
    saveResult,
    saveResultOnPageExit,
  };
};
