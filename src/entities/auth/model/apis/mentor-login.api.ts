import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

export type MentorLoginRequest = {
  email: string;
  password: string;
};

export const mentorLoginAPI = async (
  request: MentorLoginRequest,
): Promise<string> => {
  const response = await fetchInstance.post<ApiResponse<string>>(
    "/api/auth/mentor/login",
    request,
  );

  return processApiResponse(response.data);
};
