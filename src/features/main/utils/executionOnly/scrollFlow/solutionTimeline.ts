import { clamp, clamp01 } from "../../common";

// 실행 섹션 전체 진행값을 몇 단계로 나눠서 볼지 정함
export const TOTAL_UNITS = 10;

// 스크롤 몇 px를 1단계로 볼지 정함
export const PHASE_UNIT_PX = 120;

// 시작값과 끝값 사이 값을 진행도에 맞춰 구함
export const lerp = (start: number, end: number, progress: number) => {
  return start + (end - start) * clamp01(progress);
};

// 특정 구간 안에서 현재 진행도를 0부터 1 사이 값으로 바꿈
export const windowedProgress = (value: number, start: number, end: number) => {
  if (start === end) {
    return value >= end ? 1 : 0;
  }

  return clamp01((value - start) / (end - start));
};

// 초반보다 끝부분이 더 부드럽게 느껴지도록 진행도를 바꿈
export const easeOutCubic = (value: number) => {
  const normalized = clamp01(value);
  return 1 - (1 - normalized) ** 3;
};

// 실제 스크롤 거리를 실행 섹션 계산에 쓰는 단계값으로 바꿈
export const resolveProgressUnits = ({
  isActivated,
  distancePx,
}: {
  isActivated: boolean;
  distancePx: number;
}) => {
  if (!isActivated || distancePx < 0) {
    return 0;
  }

  return clamp(distancePx / PHASE_UNIT_PX, 0, TOTAL_UNITS);
};

export type SolutionTimelineState = {
  analysisPanelReveal: number;
  analysisStageReveal: number;
  intentReveal: number;
  keywordReveal: number;
  progressUnits: number;
  referenceReveal: number;
  roadmapCardsReveal: number;
  roadmapContainerReveal: number;
  roadmapListReveal: number;
  roadmapTitleReveal: number;
  summaryReveal: number;
};

// 진행 단계값을 받아서, 실행 섹션 각 부분의 노출 상태값으로 바꿈
export const deriveSolutionTimelineState = (
  progressUnitsInput: number,
): SolutionTimelineState => {
  const progressUnits = clamp(progressUnitsInput, 0, TOTAL_UNITS);

  // 분석 단계가 순서대로 열리는 구간
  const analysisStageReveal = easeOutCubic(
    windowedProgress(progressUnits, 0, 1.4),
  );
  const referenceReveal = easeOutCubic(
    windowedProgress(progressUnits, 0.3, 1.5),
  );
  const analysisPanelReveal = easeOutCubic(
    windowedProgress(progressUnits, 1.1, 2.3),
  );
  const keywordReveal = easeOutCubic(windowedProgress(progressUnits, 2.1, 3.1));
  const summaryReveal = easeOutCubic(windowedProgress(progressUnits, 3.1, 4.1));
  const intentReveal = easeOutCubic(windowedProgress(progressUnits, 4.1, 5.1));

  // 로드맵 단계가 순서대로 열리는 구간
  const roadmapContainerReveal = easeOutCubic(
    windowedProgress(progressUnits, 6.2, 7.2),
  );
  const roadmapCardsReveal = easeOutCubic(
    windowedProgress(progressUnits, 7.2, 8.4),
  );
  const roadmapListReveal = easeOutCubic(
    windowedProgress(progressUnits, 8.5, 9.7),
  );
  const roadmapTitleReveal = easeOutCubic(
    windowedProgress(progressUnits, 6.5, 7.5),
  );

  return {
    analysisPanelReveal,
    analysisStageReveal,
    intentReveal,
    keywordReveal,
    progressUnits,
    referenceReveal,
    roadmapCardsReveal,
    roadmapContainerReveal,
    roadmapListReveal,
    roadmapTitleReveal,
    summaryReveal,
  };
};
