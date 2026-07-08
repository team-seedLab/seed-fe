export const ROUTE_PATHS = {
  ROOT: "/",
  MAIN: "/",
  LOGIN: "/login",
  MYPAGE: "/mypage",
  FILE_UPLOAD: "/upload",

  UPLOAD_LOADING: "/upload/loading",
  UPLOAD_STEP_BASE: "/upload/step",
  UPLOAD_STEP: "/upload/step/:projectId/:step",
  UPLOAD_COMPLETE: "/upload/complete/:projectId",

  PROJECT_DETAIL: "/project/:projectId",

  NOT_FOUND: "*",
};

export const USER_ENTRY_ROUTE_PATHS = {
  MENTEE: ROUTE_PATHS.MYPAGE,
} as const;

export const getUserEntryRoutePath = (role?: string | null) => {
  if (!role) {
    return ROUTE_PATHS.MYPAGE;
  }

  return (
    USER_ENTRY_ROUTE_PATHS[role as keyof typeof USER_ENTRY_ROUTE_PATHS] ??
    ROUTE_PATHS.MYPAGE
  );
};

export const DYNAMIC_ROUTE_PATHS = {
  PROJECT_DETAIL: (projectId: string) =>
    ROUTE_PATHS.PROJECT_DETAIL.replace(":projectId", projectId),
  UPLOAD_STEP: (projectId: string, step: number | string) =>
    ROUTE_PATHS.UPLOAD_STEP.replace(":projectId", projectId).replace(
      ":step",
      String(step),
    ),
  UPLOAD_STEP_RESUME_ENTRY: (projectId: string) =>
    `${DYNAMIC_ROUTE_PATHS.UPLOAD_STEP(projectId, 1)}?resume=true`,
  UPLOAD_COMPLETE: (projectId: string) =>
    ROUTE_PATHS.UPLOAD_COMPLETE.replace(":projectId", projectId),
};
