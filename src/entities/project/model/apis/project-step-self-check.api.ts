import { type ApiResponse, fetchInstance, processApiResponse } from "@/shared";

import type { ProjectStepSelfCheck } from "../types";

export type ProjectStepSelfCheckParams = {
  projectId: string;
  stepCode: string;
};

export type ProjectStepSelfCheckAnswer = {
  key: string;
  answer: string;
};

export type SaveProjectStepSelfCheckParams = ProjectStepSelfCheckParams & {
  checkItems: ProjectStepSelfCheckAnswer[];
};

const getSelfCheckPath = ({
  projectId,
  stepCode,
}: ProjectStepSelfCheckParams) =>
  `/api/projects/${projectId}/steps/${stepCode}/self-check`;

export const getProjectStepSelfCheckAPI = async (
  params: ProjectStepSelfCheckParams,
): Promise<ProjectStepSelfCheck> => {
  const response = await fetchInstance.get<ApiResponse<ProjectStepSelfCheck>>(
    getSelfCheckPath(params),
  );

  return processApiResponse(response.data);
};

export const saveProjectStepSelfCheckAPI = async (
  params: SaveProjectStepSelfCheckParams,
): Promise<ProjectStepSelfCheck> => {
  const response = await fetchInstance.put<ApiResponse<ProjectStepSelfCheck>>(
    getSelfCheckPath(params),
    { checkItems: params.checkItems },
  );

  return processApiResponse(response.data);
};
