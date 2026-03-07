export const TOTAL_UNITS = 10;
export const PHASE_UNIT_PX = 120;

// Timeline math for the solution section's staged analysis and roadmap reveals.
// solution 섹션의 분석/로드맵 노출 순서를 계산하는 타임라인 수학 모듈
const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export const clamp01 = (value: number) => {
  return clamp(value, 0, 1);
};

export const lerp = (start: number, end: number, progress: number) => {
  return start + (end - start) * clamp01(progress);
};

export const windowedProgress = (value: number, start: number, end: number) => {
  if (start === end) {
    return value >= end ? 1 : 0;
  }

  return clamp01((value - start) / (end - start));
};

export const easeOutCubic = (value: number) => {
  const normalized = clamp01(value);
  return 1 - (1 - normalized) ** 3;
};

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

export const deriveSolutionTimelineState = (
  progressUnitsInput: number,
): SolutionTimelineState => {
  const progressUnits = clamp(progressUnitsInput, 0, TOTAL_UNITS);

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
