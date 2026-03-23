import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type { Project, ProjectStepResponse } from "../types";

export interface ProjectDetailResponse extends Project {
  stepResponses: ProjectStepResponse[];
}

export const getProjectDetailAPI = async (
  projectId: string,
): Promise<ProjectDetailResponse> => {
  const response = await fetchInstance.get<ApiResponse<ProjectDetailResponse>>(
    `/api/projects/${projectId}`,
  );

  return processApiResponse(response.data);
};
