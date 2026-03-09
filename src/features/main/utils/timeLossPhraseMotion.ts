import {
  TIME_LOSS_PHRASES,
  mapTimeLossPhraseXToLayout,
  mapTimeLossPhraseYToLayout,
} from "../constants";

import { clamp } from "./clamp";

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

type MotionFieldConfig = {
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

type ComputeNextTimeLossPhraseFrameParams = {
  layout: LayoutState;
  metrics: PhraseMetrics[];
  motion: MotionState;
  seeds: PhraseSeed[];
  timestamp: number;
};

type UpdateTimeLossMotionFromPointerParams = {
  height: number;
  motion: MotionState;
  pointerX: number;
  pointerY: number;
  width: number;
};

const TWO_PI = Math.PI * 2;
export const TIME_LOSS_PHRASE_FONT_SIZE = 30;

export const TIME_LOSS_PHRASE_MOTION_CONFIG: MotionFieldConfig = {
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

const wrapSigned = (value: number) => {
  const wrapped = (((value + 0.5) % 1) + 1) % 1;
  return wrapped - 0.5;
};

const fract = (value: number) => {
  return value - Math.floor(value);
};

const resolveTimeLossPhraseCollisions = (
  renders: PhraseRender[],
  metrics: PhraseMetrics[],
) => {
  const nextRenders = renders.map((render) => {
    return { ...render };
  });

  for (
    let pass = 0;
    pass < TIME_LOSS_PHRASE_MOTION_CONFIG.collisionPasses;
    pass += 1
  ) {
    for (let leftIndex = 0; leftIndex < nextRenders.length; leftIndex += 1) {
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < nextRenders.length;
        rightIndex += 1
      ) {
        const left = nextRenders[leftIndex];
        const right = nextRenders[rightIndex];
        const leftMetric = metrics[leftIndex];
        const rightMetric = metrics[rightIndex];

        const dx = right.x - left.x;
        const dy = right.y - left.y;

        const minDx =
          ((leftMetric.w * left.scale + rightMetric.w * right.scale) * 0.5 +
            TIME_LOSS_PHRASE_MOTION_CONFIG.collisionPaddingX) *
          0.7;
        const minDy =
          ((leftMetric.h * left.scale + rightMetric.h * right.scale) * 0.5 +
            TIME_LOSS_PHRASE_MOTION_CONFIG.collisionPaddingY) *
          0.7;

        if (Math.abs(dx) >= minDx || Math.abs(dy) >= minDy) {
          continue;
        }

        const overlapX = minDx - Math.abs(dx);
        const overlapY = minDy - Math.abs(dy);
        const dirX = dx === 0 ? (leftIndex % 2 === 0 ? -1 : 1) : Math.sign(dx);
        const dirY = dy === 0 ? (leftIndex % 2 === 0 ? -1 : 1) : Math.sign(dy);
        const pushX = overlapX * 0.5 * dirX;
        const pushY = overlapY * 0.5 * dirY;

        right.x += pushX;
        left.x -= pushX;
        right.y += pushY;
        left.y -= pushY;
      }
    }
  }

  return nextRenders;
};

export const buildTimeLossPhraseSeeds = (): PhraseSeed[] => {
  return TIME_LOSS_PHRASES.map((phrase, index) => {
    const baseU = mapTimeLossPhraseXToLayout(phrase.x) - 0.5;
    const baseV = mapTimeLossPhraseYToLayout(phrase.y) - 0.5;
    const jitterX =
      (fract(Math.sin((index + 1) * 12.9898) * 43758.5453) - 0.5) * 0.028;
    const jitterY =
      (fract(Math.sin((index + 1) * 78.233) * 43758.5453) - 0.5) * 0.028;

    return {
      phaseX: fract(Math.sin((index + 1) * 41.129) * 13731.773) * TWO_PI,
      phaseY: fract(Math.sin((index + 1) * 93.733) * 18347.229) * TWO_PI,
      u: wrapSigned(baseU + jitterX),
      v: wrapSigned(baseV + jitterY),
    };
  });
};

export const createInitialTimeLossMotionState = (): MotionState => {
  return {
    lastPointer: null,
    lastTimestamp: 0,
    offsetX: 0,
    offsetY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    tiltX: 0,
    tiltY: 0,
    torqueX: 0,
    torqueY: 0,
    velX: 0,
    velY: 0,
  };
};

export const createEmptyTimeLossLayoutState = (): LayoutState => {
  return {
    centerX: 0,
    centerY: 0,
    height: 0,
    width: 0,
  };
};

export const createTimeLossLayoutState = (
  width: number,
  height: number,
): LayoutState => {
  return {
    centerX: width / 2,
    centerY: height / 2,
    height,
    width,
  };
};

export const createDefaultTimeLossPhraseMetrics = (count: number) => {
  return Array.from({ length: count }, () => {
    return {
      h: TIME_LOSS_PHRASE_FONT_SIZE * 1.4,
      w: TIME_LOSS_PHRASE_FONT_SIZE * 4,
    };
  });
};

export const createInitialTimeLossPhraseRenderBuffer = (count: number) => {
  return Array.from({ length: count }, () => {
    return {
      opacity: TIME_LOSS_PHRASE_MOTION_CONFIG.baseOpacity,
      scale: 1,
      x: 0,
      y: 0,
      z: 0,
    };
  });
};

export const computeStaticTimeLossPhraseRenderBuffer = (
  layout: LayoutState,
  seeds: PhraseSeed[],
) => {
  return seeds.map((seed) => {
    return {
      opacity: TIME_LOSS_PHRASE_MOTION_CONFIG.baseOpacity,
      scale: 1,
      x: layout.centerX + seed.u * layout.width * 1.05,
      y: layout.centerY + seed.v * layout.height * 1.05,
      z: 0,
    };
  });
};

export const computeNextTimeLossPhraseFrame = ({
  layout,
  metrics,
  motion,
  seeds,
  timestamp,
}: ComputeNextTimeLossPhraseFrameParams) => {
  if (layout.width <= 0 || layout.height <= 0) {
    return {
      motion,
      renderBuffer: createInitialTimeLossPhraseRenderBuffer(seeds.length),
    };
  }

  const nextMotion = {
    ...motion,
  };
  const deltaSecRaw =
    nextMotion.lastTimestamp === 0
      ? 1 / 60
      : (timestamp - nextMotion.lastTimestamp) / 1000;
  const deltaSec = clamp(deltaSecRaw, 1 / 240, 1 / 20);

  nextMotion.lastTimestamp = timestamp;
  nextMotion.torqueX *= TIME_LOSS_PHRASE_MOTION_CONFIG.torqueDecay;
  nextMotion.torqueY *= TIME_LOSS_PHRASE_MOTION_CONFIG.torqueDecay;

  const pointerDrivenVelX =
    nextMotion.targetTiltY *
    TIME_LOSS_PHRASE_MOTION_CONFIG.positionDirectionGainX;
  const pointerDrivenVelY =
    -nextMotion.targetTiltX *
    TIME_LOSS_PHRASE_MOTION_CONFIG.positionDirectionGainY;

  nextMotion.velX =
    (nextMotion.velX + nextMotion.torqueX + pointerDrivenVelX) *
      TIME_LOSS_PHRASE_MOTION_CONFIG.friction +
    TIME_LOSS_PHRASE_MOTION_CONFIG.baseVelX;
  nextMotion.velY =
    (nextMotion.velY + nextMotion.torqueY + pointerDrivenVelY) *
      TIME_LOSS_PHRASE_MOTION_CONFIG.friction +
    TIME_LOSS_PHRASE_MOTION_CONFIG.baseVelY;

  nextMotion.velX = clamp(
    nextMotion.velX,
    -TIME_LOSS_PHRASE_MOTION_CONFIG.maxVel,
    TIME_LOSS_PHRASE_MOTION_CONFIG.maxVel,
  );
  nextMotion.velY = clamp(
    nextMotion.velY,
    -TIME_LOSS_PHRASE_MOTION_CONFIG.maxVel,
    TIME_LOSS_PHRASE_MOTION_CONFIG.maxVel,
  );
  nextMotion.offsetX = wrapSigned(
    nextMotion.offsetX + nextMotion.velX * deltaSec,
  );
  nextMotion.offsetY = wrapSigned(
    nextMotion.offsetY + nextMotion.velY * deltaSec,
  );
  nextMotion.tiltX +=
    (nextMotion.targetTiltX - nextMotion.tiltX) *
    TIME_LOSS_PHRASE_MOTION_CONFIG.tiltLerp;
  nextMotion.tiltY +=
    (nextMotion.targetTiltY - nextMotion.tiltY) *
    TIME_LOSS_PHRASE_MOTION_CONFIG.tiltLerp;

  const minOpacity = TIME_LOSS_PHRASE_MOTION_CONFIG.baseOpacity;
  const maxOpacity = TIME_LOSS_PHRASE_MOTION_CONFIG.maxOpacity;
  const scaleSpan =
    TIME_LOSS_PHRASE_MOTION_CONFIG.scaleMax -
    TIME_LOSS_PHRASE_MOTION_CONFIG.scaleMin;
  const renders = seeds.map((seed) => {
    const loopU = wrapSigned(seed.u + nextMotion.offsetX);
    const loopV = wrapSigned(seed.v + nextMotion.offsetY);
    const waveDepth =
      Math.sin(
        loopU * TWO_PI * TIME_LOSS_PHRASE_MOTION_CONFIG.waveFreqX + seed.phaseX,
      ) *
      Math.cos(
        loopV * TWO_PI * TIME_LOSS_PHRASE_MOTION_CONFIG.waveFreqY + seed.phaseY,
      );
    const tiltDepth =
      (-loopU * nextMotion.tiltY - loopV * nextMotion.tiltX) *
      TIME_LOSS_PHRASE_MOTION_CONFIG.tiltToDepth;
    const z = clamp(
      waveDepth * TIME_LOSS_PHRASE_MOTION_CONFIG.depthWaveMix + tiltDepth,
      -1,
      1,
    );
    const normalizedDepth = (z + 1) * 0.5;

    return {
      opacity: minOpacity + normalizedDepth * (maxOpacity - minOpacity),
      scale:
        TIME_LOSS_PHRASE_MOTION_CONFIG.scaleMin + normalizedDepth * scaleSpan,
      x:
        layout.centerX +
        loopU * layout.width * TIME_LOSS_PHRASE_MOTION_CONFIG.spreadX,
      y:
        layout.centerY +
        loopV * layout.height * TIME_LOSS_PHRASE_MOTION_CONFIG.spreadY +
        z * TIME_LOSS_PHRASE_MOTION_CONFIG.depthLiftPx,
      z,
    };
  });
  const renderBuffer = resolveTimeLossPhraseCollisions(renders, metrics);
  const marginX = layout.width * 0.16;
  const marginY = layout.height * 0.16;

  return {
    motion: nextMotion,
    renderBuffer: renderBuffer.map((render) => {
      return {
        ...render,
        x: clamp(render.x, -marginX, layout.width + marginX),
        y: clamp(render.y, -marginY, layout.height + marginY),
      };
    }),
  };
};

export const resetTimeLossMotionPointerTarget = (motion: MotionState) => {
  return {
    ...motion,
    lastPointer: null,
    targetTiltX: 0,
    targetTiltY: 0,
  };
};

export const updateTimeLossMotionFromPointer = ({
  height,
  motion,
  pointerX,
  pointerY,
  width,
}: UpdateTimeLossMotionFromPointerParams) => {
  const nextMotion = {
    ...motion,
  };

  if (nextMotion.lastPointer) {
    const deltaX = pointerX - nextMotion.lastPointer.x;
    const deltaY = pointerY - nextMotion.lastPointer.y;
    nextMotion.torqueX = clamp(
      nextMotion.torqueX + deltaX * TIME_LOSS_PHRASE_MOTION_CONFIG.pointerGainX,
      -TIME_LOSS_PHRASE_MOTION_CONFIG.maxTorque,
      TIME_LOSS_PHRASE_MOTION_CONFIG.maxTorque,
    );
    nextMotion.torqueY = clamp(
      nextMotion.torqueY + deltaY * TIME_LOSS_PHRASE_MOTION_CONFIG.pointerGainY,
      -TIME_LOSS_PHRASE_MOTION_CONFIG.maxTorque,
      TIME_LOSS_PHRASE_MOTION_CONFIG.maxTorque,
    );
  }

  nextMotion.lastPointer = {
    x: pointerX,
    y: pointerY,
  };

  if (width <= 0 || height <= 0) {
    return nextMotion;
  }

  const normalizedX = (pointerX / width - 0.5) * 2;
  const normalizedY = (pointerY / height - 0.5) * 2;

  nextMotion.targetTiltX = clamp(
    normalizedY * TIME_LOSS_PHRASE_MOTION_CONFIG.tiltMax,
    -TIME_LOSS_PHRASE_MOTION_CONFIG.tiltMax,
    TIME_LOSS_PHRASE_MOTION_CONFIG.tiltMax,
  );
  nextMotion.targetTiltY = clamp(
    -normalizedX * TIME_LOSS_PHRASE_MOTION_CONFIG.tiltMax,
    -TIME_LOSS_PHRASE_MOTION_CONFIG.tiltMax,
    TIME_LOSS_PHRASE_MOTION_CONFIG.tiltMax,
  );

  return nextMotion;
};
