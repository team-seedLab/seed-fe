import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type { ProjectStatus } from "../types";

import {
  type ProjectListApiResponse,
  type ProjectListResponse,
  mapProjectListResponse,
} from "./project-list.mapper";

export type { ProjectListResponse } from "./project-list.mapper";

export interface ProjectListParameters {
  page?: number;
  size?: number;
  sort?: string;
  status?: ProjectStatus;
}

export const getProjectListAPI = async (
  params: ProjectListParameters,
): Promise<ProjectListResponse> => {
  const response = await fetchInstance.get<ApiResponse<ProjectListApiResponse>>(
    "/api/projects",
    {
      params,
    },
  );
  return mapProjectListResponse(processApiResponse(response.data));
};
