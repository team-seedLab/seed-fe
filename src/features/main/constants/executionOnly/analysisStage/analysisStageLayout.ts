// 분석 내용 높이를 아직 못 쟀을 때 대신 쓰는 기본 높이값을 정함
export const FALLBACK_ANALYSIS_CONTENT_HEIGHT = 940;

// 아래에서 올라오듯 보이는 기본 스타일을 만듦
export const fadeUpStyle = (progress: number, distance: number) => {
  return {
    opacity: progress,
    transform: `translateY(${((1 - progress) * distance).toFixed(2)}px)`,
  };
};

// 참고 자료 패널이 들어오고 옆으로 밀리는 스타일을 만듦
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

// 분석 패널이 가운데로 들어오는 스타일을 만듦
export const analysisPanelStageStyle = (progress: number) => {
  const x = -48 + 360 * progress;
  const y = (1 - progress) * 20;

  return {
    opacity: progress,
    transform: `translate(-50%, -50%) translateX(${x.toFixed(2)}px) translateY(${y.toFixed(2)}px)`,
  };
};
