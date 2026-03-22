import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type { RoadmapType } from "../types";

export interface CreateProjectRequest {
  title: string;
  roadmapType: RoadmapType;
  userIntent: string;
  files: File[];
}

export interface CreateProjectResponse {
  projectId: string;
}

export const createProjectAPI = async (
  params: CreateProjectRequest,
): Promise<CreateProjectResponse> => {
  const formData = new FormData();
  formData.append("title", params.title);
  formData.append("roadmapType", params.roadmapType);
  formData.append("userIntent", params.userIntent);
  params.files.forEach((file) => formData.append("files", file));

  const response = await fetchInstance.post<ApiResponse<CreateProjectResponse>>(
    "/api/projects",
    formData,
    {
      headers: { "Content-Type": undefined },
      timeout: 60000,
    },
  );
  return processApiResponse(response.data);
};
