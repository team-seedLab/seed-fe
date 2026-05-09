import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type { Project, ProjectStepResponse } from "../types";

export interface ProjectDetailResponse extends Project {
  stepResponses: ProjectStepResponse[];
}

interface ProjectDetailApiResponse {
  summary: Project;
  stepResponses: ProjectStepResponse[];
}

export const getProjectDetailAPI = async (
  projectId: string,
): Promise<ProjectDetailResponse> => {
  const response = await fetchInstance.get<
    ApiResponse<ProjectDetailApiResponse>
  >(`/api/projects/${projectId}`);

  const data = processApiResponse(response.data);
  const summary = data.summary;

  return {
    projectId: summary.projectId,
    title: summary.title,
    roadmapType: summary.roadmapType,
    status: summary.status,
    createdAt: summary.createdAt,
    stepResponses: data.stepResponses,
  };
};
