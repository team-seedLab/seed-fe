import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type {
  Project,
  ProjectInitialContext,
  ProjectStepResponse,
} from "../types";

export interface ProjectDetailResponse extends Project {
  initialContext: ProjectInitialContext;
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
