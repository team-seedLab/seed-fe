import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

export const completeProjectAPI = async (projectId: string): Promise<void> => {
  const response = await fetchInstance.patch<ApiResponse<void>>(
    `/api/projects/${projectId}/complete`,
  );
  return processApiResponse(response.data);
};
