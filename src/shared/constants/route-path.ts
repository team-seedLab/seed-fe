export const ROUTE_PATHS = {
  ROOT: "/",
  MAIN: "/",
  LOGIN: "/login",
  MENTOR_LOGIN: "/login/mentor",
  MENTOR_DASHBOARD: "/mentor/dashboard",
  MENTOR_MENTEE_PROJECTS: "/mentor/mentees/:menteeId/projects",
  MYPAGE: "/mypage",
  FILE_UPLOAD: "/upload",

  UPLOAD_LOADING: "/upload/loading",
  UPLOAD_STEP_BASE: "/upload/step",
  UPLOAD_STEP: "/upload/step/:projectId/:step",

  PROJECT_DETAIL: "/project/:projectId",

  NOT_FOUND: "*",
};

export const DYNAMIC_ROUTE_PATHS = {
  PROJECT_DETAIL: (projectId: string) =>
    ROUTE_PATHS.PROJECT_DETAIL.replace(":projectId", projectId),
  MENTOR_MENTEE_PROJECTS: (menteeId: string) =>
    ROUTE_PATHS.MENTOR_MENTEE_PROJECTS.replace(":menteeId", menteeId),
  UPLOAD_STEP: (projectId: string, step: number | string) =>
    ROUTE_PATHS.UPLOAD_STEP.replace(":projectId", projectId).replace(
      ":step",
      String(step),
    ),
  UPLOAD_STEP_RESUME_ENTRY: (projectId: string) =>
    `${DYNAMIC_ROUTE_PATHS.UPLOAD_STEP(projectId, 1)}?resume=true`,
};
