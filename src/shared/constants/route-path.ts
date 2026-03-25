// 기본적인 router path를 상수로 정의합니다.
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

// 동적 라우트 path를 상수로 정의합니다.
export const DYNAMIC_ROUTE_PATHS = {
  PROJECT_DETAIL: (projectId: string) =>
    ROUTE_PATHS.PROJECT_DETAIL.replace(":projectId", projectId),
};
