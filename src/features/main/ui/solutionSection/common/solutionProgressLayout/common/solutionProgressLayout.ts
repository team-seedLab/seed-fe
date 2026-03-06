export const INITIAL_TITLE_STAGE_MIN_HEIGHT = "100dvh";
export const FALLBACK_ANALYSIS_CONTENT_HEIGHT = 940;
export const FALLBACK_ROADMAP_CONTENT_HEIGHT = 900;

// Shared motion and layout helpers for the staged solution walkthrough.
// solution walkthrough 단계에서 공통으로 쓰는 모션과 레이아웃 계산 함수들
export const fadeUpStyle = (progress: number, distance: number) => {
  return {
    opacity: progress,
    transform: `translateY(${((1 - progress) * distance).toFixed(2)}px)`,
  };
};

export const referencePanelStageStyle = (
  enterProgress: number,
  shiftProgress: number,
) => {
  const x = -280 * shiftProgress;
  const y = (1 - enterProgress) * 28;
  const scale = 0.94 + 0.06 * enterProgress;

  return {
    opacity: enterProgress,
    transform: `translate(-50%, -50%) translateX(${x.toFixed(2)}px) translateY(${y.toFixed(2)}px) scale(${scale.toFixed(4)})`,
  };
};

export const analysisPanelStageStyle = (progress: number) => {
  const x = -48 + 360 * progress;
  const y = (1 - progress) * 20;

  return {
    opacity: progress,
    transform: `translate(-50%, -50%) translateX(${x.toFixed(2)}px) translateY(${y.toFixed(2)}px)`,
  };
};

export const revealMaxHeight = (progress: number, maxHeightPx: number) => {
  return `${(progress * maxHeightPx).toFixed(2)}px`;
};
