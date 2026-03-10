// 실행 섹션 첫 화면이 최소한 차지해야 하는 높이를 정함
export const INITIAL_TITLE_STAGE_MIN_HEIGHT = "100dvh";

// 로드맵 높이를 아직 못 쟀을 때 대신 쓰는 기본 높이값을 정함
export const FALLBACK_ROADMAP_CONTENT_HEIGHT = 900;

// 실행 섹션 전체 진행값을 몇 단계로 나눠서 볼지 정함
export const TOTAL_UNITS = 10;

// 스크롤 몇 px를 1단계로 볼지 정함
export const PHASE_UNIT_PX = 120;

// 실제 스크롤 길이
export const EXECUTION_ONLY_SCROLL_DISTANCE_PX = TOTAL_UNITS * PHASE_UNIT_PX;
