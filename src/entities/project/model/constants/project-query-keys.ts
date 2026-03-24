import type { ProjectListParameters } from "../apis";

const PROJECT_QUERY_KEY = "project";

export const projectKeys = {
  all: () => [PROJECT_QUERY_KEY] as const,
  lists: () => [...projectKeys.all(), "list"] as const,
  details: () => [...projectKeys.all(), "detail"] as const,
  list: (params: ReturnType<typeof normalizeProjectListQueryParams>) =>
    [
      ...projectKeys.lists(),
      params.page,
      params.size,
      params.sort,
      params.status,
    ] as const,
  detail: (projectId: string) => [...projectKeys.details(), projectId] as const,
};

export const normalizeProjectListQueryParams = (
  params: ProjectListParameters = {},
) => {
  return {
    page: params.page ?? 0,
    size: params.size ?? 10,
    sort: params.sort ?? "createdAt,DESC",
    ...(params.status && { status: params.status }),
  };
};
