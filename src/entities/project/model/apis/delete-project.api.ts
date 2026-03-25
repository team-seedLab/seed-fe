import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

export const deleteProjectAPI = async (projectId: string): Promise<void> => {
  const response = await fetchInstance.delete<ApiResponse<void>>(
    `/api/projects/${projectId}`,
  );
  return processApiResponse(response.data);
};
