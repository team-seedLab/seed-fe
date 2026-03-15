export const fadeUpStyleDesktopOnly = (progress: number, distance: number) => {
  return {
    opacity: { base: 1, lg: progress },
    transform: {
      base: "none",
      lg: `translateY(${((1 - progress) * distance).toFixed(2)}px)`,
    },
  };
};

export const referencePanelStageStyleDesktopOnly = (
  enterProgress: number,
  shiftProgress: number,
) => {
  const x = -280 * shiftProgress;
  const y = (1 - enterProgress) * 28;
  const scale = 0.94 + 0.06 * enterProgress;

  return {
    opacity: { base: 1, lg: enterProgress },
    transform: {
      base: "none",
      lg: `translate(-50%, -50%) translateX(${x.toFixed(2)}px) translateY(${y.toFixed(2)}px) scale(${scale.toFixed(4)})`,
    },
  };
};

export const analysisPanelStageStyleDesktopOnly = (progress: number) => {
  const x = -48 + 360 * progress;
  const y = (1 - progress) * 20;

  return {
    opacity: { base: 1, lg: progress },
    transform: {
      base: "none",
      lg: `translate(-50%, -50%) translateX(${x.toFixed(2)}px) translateY(${y.toFixed(2)}px)`,
    },
  };
};

//Stage 컨테이너(analysis, roadmap)의 공통 스타일
export const stageContainerStyle = (
  reveal: number,
  height: number,
  distancePx: number,
) => ({
  maxH: { base: "none", xl: `${(height * reveal).toFixed(2)}px` },
  opacity: { base: 1, xl: reveal },
  overflow: { base: "visible", xl: "hidden" },
  transform: {
    base: "none",
    xl: `translateY(${((1 - reveal) * distancePx).toFixed(2)}px)`,
  },
  transition: {
    base: "none",
    xl: [
      "max-height 240ms cubic-bezier(0.22, 1, 0.36, 1)",
      "opacity 220ms ease",
      "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
    ].join(", "),
  },
});
