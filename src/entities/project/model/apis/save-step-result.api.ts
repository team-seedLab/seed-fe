import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

export interface SaveStepResultRequest {
  projectId: string;
  stepCode: string;
  resultText: string;
}

export const saveStepResultAPI = async (
  params: SaveStepResultRequest,
): Promise<void> => {
  const response = await fetchInstance.patch<ApiResponse<void>>(
    `/api/projects/${params.projectId}/steps/${params.stepCode}/result`,
    { resultText: params.resultText },
  );
  return processApiResponse(response.data);
};
