import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type { ProjectStepAiMessage, ProjectStepAiMessageType } from "../types";

const AI_MENTOR_RESPONSE_TIMEOUT_MS = 40_000;

export type ProjectStepAiMessageParams = {
  projectId: string;
  stepCode: string;
};

export type CreateProjectStepAiMessageParams = ProjectStepAiMessageParams & {
  messageType: ProjectStepAiMessageType;
  content: string;
};

const getAiMessagePath = ({
  projectId,
  stepCode,
}: ProjectStepAiMessageParams) =>
  `/api/projects/${projectId}/steps/${stepCode}/ai-messages`;

export const getProjectStepAiMessagesAPI = async (
  params: ProjectStepAiMessageParams,
): Promise<ProjectStepAiMessage[]> => {
  const response = await fetchInstance.get<ApiResponse<ProjectStepAiMessage[]>>(
    getAiMessagePath(params),
  );

  return processApiResponse(response.data);
};

export const createProjectStepAiMessageAPI = async (
  params: CreateProjectStepAiMessageParams,
): Promise<ProjectStepAiMessage[]> => {
  const response = await fetchInstance.post<
    ApiResponse<ProjectStepAiMessage[]>
  >(
    getAiMessagePath(params),
    {
      messageType: params.messageType,
      content: params.content,
    },
    { timeout: AI_MENTOR_RESPONSE_TIMEOUT_MS },
  );

  return processApiResponse(response.data);
};
