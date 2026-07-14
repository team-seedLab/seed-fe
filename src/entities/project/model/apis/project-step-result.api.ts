import { isAxiosError } from "axios";

import {
  type ApiResponse,
  type ErrorResponse,
  fetchInstance,
  processApiResponse,
} from "@/shared";

import type { ProjectStepResult } from "../types";

export type ProjectStepResultParams = {
  projectId: string;
  stepCode: string;
};

export type SaveProjectStepResultParams = ProjectStepResultParams & {
  contentMarkdown: string;
};

const GENERATED_RESULT_NOT_FOUND_ERROR_CODE = "AP003";

const getResultPath = ({ projectId, stepCode }: ProjectStepResultParams) =>
  `/api/projects/${projectId}/steps/${stepCode}/result`;

export const getProjectStepResultAPI = async (
  params: ProjectStepResultParams,
): Promise<ProjectStepResult | null> => {
  try {
    const response = await fetchInstance.get<ApiResponse<ProjectStepResult>>(
      getResultPath(params),
    );

    return processApiResponse(response.data);
  } catch (error) {
    if (
      isAxiosError<ErrorResponse>(error) &&
      error.response?.data.errorCode === GENERATED_RESULT_NOT_FOUND_ERROR_CODE
    ) {
      return null;
    }

    throw error;
  }
};

export const saveProjectStepResultAPI = async (
  params: SaveProjectStepResultParams,
): Promise<ProjectStepResult> => {
  const response = await fetchInstance.put<ApiResponse<ProjectStepResult>>(
    getResultPath(params),
    { contentMarkdown: params.contentMarkdown },
  );

  return processApiResponse(response.data);
};
