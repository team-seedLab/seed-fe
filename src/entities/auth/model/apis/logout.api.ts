import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

export const logoutAPI = async (): Promise<void> => {
  const response =
    await fetchInstance.post<ApiResponse<void>>("/api/auth/logout");
  return processApiResponse(response.data);
};
