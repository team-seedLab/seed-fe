import {
  PHASE_UNIT_PX,
  TOTAL_UNITS,
} from "../constants/execution-only/solutionProgressLayout";

import { clamp, clamp01 } from "./clamp";
import {
  clampedLerp as lerp,
  scrollTravelProgress,
  windowedProgress,
} from "./progressMath";

export { lerp, windowedProgress };

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

export const resolveSceneProgressUnits = ({
  isActivated,
  sceneHeight,
  sceneTop,
  viewportHeight,
}: {
  isActivated: boolean;
  sceneHeight: number;
  sceneTop: number;
  viewportHeight: number;
}) => {
  if (!isActivated) {
    return 0;
  }

  return (
    scrollTravelProgress({
      height: sceneHeight,
      top: sceneTop,
      viewportHeight,
    }) * TOTAL_UNITS
  );
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
