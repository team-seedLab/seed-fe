// HTTP 상태 코드별 기본 에러 메시지
export const HTTP_ERROR_MESSAGES = {
  400: "잘못된 요청입니다. 입력 정보를 확인해주세요.",
  401: "인증이 필요합니다. 다시 로그인해주세요.",
  403: "권한이 없습니다.",
  404: "요청한 리소스를 찾을 수 없습니다.",
  409: "중복된 데이터입니다.",
  413: "업로드 용량이 초과되었습니다.",
  500: "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  default: "요청을 처리할 수 없습니다.",
} as const;

// API 에러 코드별 메시지
export const API_ERROR_MESSAGES = {
  DUPLICATE_USER_ID: "이미 사용 중인 아이디입니다.",
  DUPLICATE_NICKNAME: "이미 사용 중인 닉네임입니다.",
  INVALID_PASSWORD: "비밀번호가 올바르지 않습니다.",
  USER_NOT_FOUND: "존재하지 않는 사용자입니다.",
} as const;
