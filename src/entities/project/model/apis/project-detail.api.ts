import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import {
  type ProjectDetailApiResponse,
  type ProjectDetailResponse,
  mapProjectDetailResponse,
} from "./project-detail.mapper";

export type { ProjectDetailResponse } from "./project-detail.mapper";

export const getProjectDetailAPI = async (
  projectId: string,
): Promise<ProjectDetailResponse> => {
  const response = await fetchInstance.get<
    ApiResponse<ProjectDetailApiResponse>
  >(`/api/projects/${projectId}`);

  return mapProjectDetailResponse(processApiResponse(response.data));
};
