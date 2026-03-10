export type PhraseSeed = {
  phaseX: number;
  phaseY: number;
  u: number;
  v: number;
};

export type PhraseMetrics = {
  h: number;
  w: number;
};

export type PhraseRender = {
  opacity: number;
  scale: number;
  x: number;
  y: number;
  z: number;
};

export type LayoutState = {
  centerX: number;
  centerY: number;
  height: number;
  width: number;
};

export type MotionState = {
  lastPointer: { x: number; y: number } | null;
  lastTimestamp: number;
  offsetX: number;
  offsetY: number;
  targetTiltX: number;
  targetTiltY: number;
  tiltX: number;
  tiltY: number;
  torqueX: number;
  torqueY: number;
  velX: number;
  velY: number;
};

export type PhraseCloudMotionConfig = {
  baseOpacity: number;
  baseVelX: number;
  baseVelY: number;
  collisionPaddingX: number;
  collisionPaddingY: number;
  collisionPasses: number;
  depthLiftPx: number;
  depthWaveMix: number;
  friction: number;
  maxOpacity: number;
  maxTorque: number;
  maxVel: number;
  pointerGainX: number;
  pointerGainY: number;
  positionDirectionGainX: number;
  positionDirectionGainY: number;
  scaleMax: number;
  scaleMin: number;
  spreadX: number;
  spreadY: number;
  tiltLerp: number;
  tiltMax: number;
  tiltToDepth: number;
  torqueDecay: number;
  waveFreqX: number;
  waveFreqY: number;
};

export type ComputeNextPhraseCloudFrameParams = {
  layout: LayoutState;
  metrics: PhraseMetrics[];
  motion: MotionState;
  seeds: PhraseSeed[];
  timestamp: number;
};

export type UpdatePhraseCloudMotionFromPointerParams = {
  height: number;
  motion: MotionState;
  pointerX: number;
  pointerY: number;
  width: number;
};
