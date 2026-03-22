import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type { Project } from "../types";

export interface ProjectStepResponse {
  stepCode: string;
  stepName: string;
  providedPromptSnapshot: string;
  formatPrompt?: string;
}

export interface ProjectDetailResponse extends Project {
  stepResponses?: ProjectStepResponse[];
}

export const getProjectDetailAPI = async (
  projectId: string,
): Promise<ProjectDetailResponse> => {
  const response = await fetchInstance.get<ApiResponse<ProjectDetailResponse>>(
    `/api/projects/${projectId}`,
  );

  return processApiResponse(response.data);
};
