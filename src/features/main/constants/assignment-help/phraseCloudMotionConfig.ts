import type { PhraseCloudMotionConfig } from "../../types";

export const PHRASE_CLOUD_FONT_SIZE = 30;

export const PHRASE_CLOUD_MOTION_CONFIG: PhraseCloudMotionConfig = {
  baseOpacity: 0.44,
  baseVelX: 0.0052,
  baseVelY: -0.0036,
  collisionPaddingX: 32,
  collisionPaddingY: 22,
  collisionPasses: 1,
  depthLiftPx: 18,
  depthWaveMix: 0.72,
  friction: 0.91,
  maxOpacity: 1,
  maxTorque: 0.05,
  maxVel: 0.055,
  pointerGainX: 0.00008,
  pointerGainY: 0.00008,
  positionDirectionGainX: 0.012,
  positionDirectionGainY: 0.009,
  scaleMax: 1.28,
  scaleMin: 0.84,
  spreadX: 1.2,
  spreadY: 1.24,
  tiltLerp: 0.08,
  tiltMax: 0.85,
  tiltToDepth: 0.95,
  torqueDecay: 0.8,
  waveFreqX: 1.12,
  waveFreqY: 1.02,
};
