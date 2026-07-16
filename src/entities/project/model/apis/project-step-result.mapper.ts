import type { ProjectStepResult } from "../types";

export type ProjectStepResultApiResponse = Omit<
  ProjectStepResult,
  "contentMarkdown"
> & {
  contentMarkdown: string | null;
};

export const mapProjectStepResultResponse = (
  response: ProjectStepResultApiResponse,
): ProjectStepResult => ({
  ...response,
  contentMarkdown: response.contentMarkdown ?? "",
});
