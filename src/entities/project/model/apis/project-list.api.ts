import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type { Project } from "../types";

export interface ProjectListResponse {
  content: Project[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ProjectListParameters {
  page?: number;
  size?: number;
  sort?: string;
}

export const getProjectListAPI = async (
  params: ProjectListParameters,
): Promise<ProjectListResponse> => {
  const response = await fetchInstance.get<ApiResponse<ProjectListResponse>>(
    "/api/projects",
    {
      params,
    },
  );
  return processApiResponse(response.data);
};
