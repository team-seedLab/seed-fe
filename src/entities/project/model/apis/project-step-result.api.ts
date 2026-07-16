import { isAxiosError } from "axios";

import {
  type ApiResponse,
  type ErrorResponse,
  SERVER_PATH,
  fetchInstance,
  processApiResponse,
} from "@/shared";

import type { ProjectStepResult } from "../types";

import {
  type ProjectStepResultApiResponse,
  mapProjectStepResultResponse,
} from "./project-step-result.mapper";

export type ProjectStepResultParams = {
  projectId: string;
  stepCode: string;
};

export type SaveProjectStepResultParams = ProjectStepResultParams & {
  contentMarkdown: string;
  signal?: AbortSignal;
};

const GENERATED_RESULT_NOT_FOUND_ERROR_CODE = "AP003";
const KEEPALIVE_BODY_MAX_BYTES = 64 * 1024;

const getResultPath = ({ projectId, stepCode }: ProjectStepResultParams) =>
  `/api/projects/${projectId}/steps/${stepCode}/result`;

export const getProjectStepResultAPI = async (
  params: ProjectStepResultParams,
): Promise<ProjectStepResult | null> => {
  try {
    const response = await fetchInstance.get<
      ApiResponse<ProjectStepResultApiResponse>
    >(getResultPath(params));

    return mapProjectStepResultResponse(processApiResponse(response.data));
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
  const response = await fetchInstance.put<
    ApiResponse<ProjectStepResultApiResponse>
  >(
    getResultPath(params),
    { contentMarkdown: params.contentMarkdown },
    { signal: params.signal },
  );

  return mapProjectStepResultResponse(processApiResponse(response.data));
};

export const saveProjectStepResultOnPageExitAPI = async (
  params: SaveProjectStepResultParams,
): Promise<void> => {
  const body = JSON.stringify({ contentMarkdown: params.contentMarkdown });

  if (new TextEncoder().encode(body).byteLength > KEEPALIVE_BODY_MAX_BYTES) {
    return;
  }

  try {
    await fetch(new URL(getResultPath(params), SERVER_PATH), {
      method: "PUT",
      body,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      keepalive: true,
    });
  } catch {
    return;
  }
};
