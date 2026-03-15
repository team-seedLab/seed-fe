// 모든 응답에 공통으로 들어가는 필드를 BaseResponse로 정의
interface BaseResponse {
  status: "SUCCESS" | "ERROR";
  serverDateTime: string;
}

// 요청이 성공했을 때의 응답 타입
// BaseResponse를 확장하고, status를 'SUCCESS'로 고정시킨다.
// 제네릭 T를 사용해서, 실제 데이터의 타입을 받아온다.
interface SuccessResponse<T> extends BaseResponse {
  status: "SUCCESS";
  data: T;
}

// 요청이 실패했을 때의 응답 타입
// BaseResponse를 확장하고, status를 'ERROR'로 고정시킨다.
export interface ErrorResponse extends BaseResponse {
  status: "ERROR";
  errorCode: string;
  errorMessage: string;
}

// 최종 ApiResponse<T> 타입
// 성공 또는 실패, 두 가지 케이스 중 하나가 된다.
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
