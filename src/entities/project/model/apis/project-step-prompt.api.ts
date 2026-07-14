import {
  type ApiResponse,
  SERVER_PATH,
  fetchInstance,
  processApiResponse,
} from "@/shared";

import type { ProjectStepPrompt } from "../types";

export type ProjectStepPromptParams = {
  projectId: string;
  stepCode: string;
};

export type UpdateProjectStepPromptParams = ProjectStepPromptParams & {
  editedPrompt: string;
};

const getPromptPath = ({ projectId, stepCode }: ProjectStepPromptParams) =>
  `/api/projects/${projectId}/steps/${stepCode}/prompt`;

export const createProjectStepPromptAPI = async (
  params: ProjectStepPromptParams,
): Promise<ProjectStepPrompt> => {
  const response = await fetchInstance.post<ApiResponse<ProjectStepPrompt>>(
    getPromptPath(params),
  );

  return processApiResponse(response.data);
};

export const getProjectStepPromptAPI = async (
  params: ProjectStepPromptParams,
): Promise<ProjectStepPrompt> => {
  const response = await fetchInstance.get<ApiResponse<ProjectStepPrompt>>(
    getPromptPath(params),
  );

  return processApiResponse(response.data);
};

export const updateProjectStepPromptAPI = async (
  params: UpdateProjectStepPromptParams,
): Promise<ProjectStepPrompt> => {
  const response = await fetchInstance.put<ApiResponse<ProjectStepPrompt>>(
    getPromptPath(params),
    { editedPrompt: params.editedPrompt },
  );

  return processApiResponse(response.data);
};

export const updateProjectStepPromptOnPageExitAPI = async (
  params: UpdateProjectStepPromptParams,
): Promise<void> => {
  try {
    await fetch(new URL(getPromptPath(params), SERVER_PATH), {
      method: "PUT",
      body: JSON.stringify({ editedPrompt: params.editedPrompt }),
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      keepalive: true,
    });
  } catch {
    return;
  }
};
