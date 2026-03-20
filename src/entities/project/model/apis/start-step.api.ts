import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type { ProjectStepResponse } from "../types";

export interface StartStepRequest {
  projectId: string;
  stepCode: string;
}

export const startStepAPI = async (
  params: StartStepRequest,
): Promise<ProjectStepResponse> => {
  const response = await fetchInstance.post<ApiResponse<ProjectStepResponse>>(
    `/api/projects/${params.projectId}/steps/${params.stepCode}`,
  );
  return processApiResponse(response.data);
};
