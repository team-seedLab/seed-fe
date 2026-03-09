// 기본적인 router path를 상수로 정의합니다.
export const ROUTE_PATHS = {
  ROOT: "/",
  MAIN: "/",
  MYPAGE: "/mypage",
  FILE_UPLOAD: "/upload",

  UPLOAD_LOADING: "/upload/loading",
  UPLOAD_STEP_BASE: "/upload/step",
  UPLOAD_STEP: "/upload/step/:step",
  UPLOAD_COMPLETE: "/upload/complete",

  NOT_FOUND: "*",
};

// 동적 라우트 path를 상수로 정의합니다.
export const DYNAMIC_ROUTE_PATHS = {};
