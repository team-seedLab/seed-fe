import {
  PHRASE_CLOUD_FONT_SIZE,
  PHRASE_CLOUD_MOTION_CONFIG,
  PHRASE_CLOUD_PHRASES,
} from "../constants";
import type {
  ComputeNextPhraseCloudFrameParams,
  LayoutState,
  MotionState,
  PhraseMetrics,
  PhraseRender,
  PhraseSeed,
  UpdatePhraseCloudMotionFromPointerParams,
} from "../types";

import { clamp } from "./clamp";

const TWO_PI = Math.PI * 2;

const PHRASE_CLOUD_X_MIN_MARGIN = 0.06;
const PHRASE_CLOUD_X_MAX_MARGIN = 0.94;
const PHRASE_CLOUD_Y_MIN_MARGIN = 0.08;
const PHRASE_CLOUD_Y_MAX_MARGIN = 0.92;
const PHRASE_CLOUD_RAW_X_MIN = Math.min(
  ...PHRASE_CLOUD_PHRASES.map((phrase) => phrase.x),
);
const PHRASE_CLOUD_RAW_X_MAX = Math.max(
  ...PHRASE_CLOUD_PHRASES.map((phrase) => phrase.x),
);
const PHRASE_CLOUD_RAW_Y_MIN = Math.min(
  ...PHRASE_CLOUD_PHRASES.map((phrase) => phrase.y),
);
const PHRASE_CLOUD_RAW_Y_MAX = Math.max(
  ...PHRASE_CLOUD_PHRASES.map((phrase) => phrase.y),
);
const PHRASE_CLOUD_RAW_X_SPAN = Math.max(
  PHRASE_CLOUD_RAW_X_MAX - PHRASE_CLOUD_RAW_X_MIN,
  0.0001,
);
const PHRASE_CLOUD_RAW_Y_SPAN = Math.max(
  PHRASE_CLOUD_RAW_Y_MAX - PHRASE_CLOUD_RAW_Y_MIN,
  0.0001,
);

const wrapSigned = (value: number) => {
  const wrapped = (((value + 0.5) % 1) + 1) % 1;
  return wrapped - 0.5;
};

const fract = (value: number) => {
  return value - Math.floor(value);
};

const mapPhraseCloudXToLayout = (rawX: number) => {
  const normalizedX = (rawX - PHRASE_CLOUD_RAW_X_MIN) / PHRASE_CLOUD_RAW_X_SPAN;

  return (
    PHRASE_CLOUD_X_MIN_MARGIN +
    normalizedX * (PHRASE_CLOUD_X_MAX_MARGIN - PHRASE_CLOUD_X_MIN_MARGIN)
  );
};

const mapPhraseCloudYToLayout = (rawY: number) => {
  const normalizedY = (rawY - PHRASE_CLOUD_RAW_Y_MIN) / PHRASE_CLOUD_RAW_Y_SPAN;

  return (
    PHRASE_CLOUD_Y_MIN_MARGIN +
    normalizedY * (PHRASE_CLOUD_Y_MAX_MARGIN - PHRASE_CLOUD_Y_MIN_MARGIN)
  );
};

const resolvePhraseCloudCollisions = (
  renders: PhraseRender[],
  metrics: PhraseMetrics[],
) => {
  const nextRenders = renders.map((render) => {
    return { ...render };
  });

  for (
    let pass = 0;
    pass < PHRASE_CLOUD_MOTION_CONFIG.collisionPasses;
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
            PHRASE_CLOUD_MOTION_CONFIG.collisionPaddingX) *
          0.7;
        const minDy =
          ((leftMetric.h * left.scale + rightMetric.h * right.scale) * 0.5 +
            PHRASE_CLOUD_MOTION_CONFIG.collisionPaddingY) *
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

export const buildPhraseCloudSeeds = (): PhraseSeed[] => {
  return PHRASE_CLOUD_PHRASES.map((phrase, index) => {
    const baseU = mapPhraseCloudXToLayout(phrase.x) - 0.5;
    const baseV = mapPhraseCloudYToLayout(phrase.y) - 0.5;
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

export const createInitialPhraseCloudMotionState = (): MotionState => {
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

export const createEmptyPhraseCloudLayoutState = (): LayoutState => {
  return {
    centerX: 0,
    centerY: 0,
    height: 0,
    width: 0,
  };
};

export const createPhraseCloudLayoutState = (
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

export const createDefaultPhraseCloudMetrics = (count: number) => {
  return Array.from({ length: count }, () => {
    return {
      h: PHRASE_CLOUD_FONT_SIZE * 1.4,
      w: PHRASE_CLOUD_FONT_SIZE * 4,
    };
  });
};

export const createInitialPhraseCloudRenderBuffer = (count: number) => {
  return Array.from({ length: count }, () => {
    return {
      opacity: PHRASE_CLOUD_MOTION_CONFIG.baseOpacity,
      scale: 1,
      x: 0,
      y: 0,
      z: 0,
    };
  });
};

export const computeStaticPhraseCloudRenderBuffer = (
  layout: LayoutState,
  seeds: PhraseSeed[],
) => {
  return seeds.map((seed) => {
    return {
      opacity: PHRASE_CLOUD_MOTION_CONFIG.baseOpacity,
      scale: 1,
      x: layout.centerX + seed.u * layout.width * 1.05,
      y: layout.centerY + seed.v * layout.height * 1.05,
      z: 0,
    };
  });
};

export const computeNextPhraseCloudFrame = ({
  layout,
  metrics,
  motion,
  seeds,
  timestamp,
}: ComputeNextPhraseCloudFrameParams) => {
  if (layout.width <= 0 || layout.height <= 0) {
    return {
      motion,
      renderBuffer: createInitialPhraseCloudRenderBuffer(seeds.length),
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
  nextMotion.torqueX *= PHRASE_CLOUD_MOTION_CONFIG.torqueDecay;
  nextMotion.torqueY *= PHRASE_CLOUD_MOTION_CONFIG.torqueDecay;

  const pointerDrivenVelX =
    nextMotion.targetTiltY * PHRASE_CLOUD_MOTION_CONFIG.positionDirectionGainX;
  const pointerDrivenVelY =
    -nextMotion.targetTiltX * PHRASE_CLOUD_MOTION_CONFIG.positionDirectionGainY;

  nextMotion.velX =
    (nextMotion.velX + nextMotion.torqueX + pointerDrivenVelX) *
      PHRASE_CLOUD_MOTION_CONFIG.friction +
    PHRASE_CLOUD_MOTION_CONFIG.baseVelX;
  nextMotion.velY =
    (nextMotion.velY + nextMotion.torqueY + pointerDrivenVelY) *
      PHRASE_CLOUD_MOTION_CONFIG.friction +
    PHRASE_CLOUD_MOTION_CONFIG.baseVelY;

  nextMotion.velX = clamp(
    nextMotion.velX,
    -PHRASE_CLOUD_MOTION_CONFIG.maxVel,
    PHRASE_CLOUD_MOTION_CONFIG.maxVel,
  );
  nextMotion.velY = clamp(
    nextMotion.velY,
    -PHRASE_CLOUD_MOTION_CONFIG.maxVel,
    PHRASE_CLOUD_MOTION_CONFIG.maxVel,
  );
  nextMotion.offsetX = wrapSigned(
    nextMotion.offsetX + nextMotion.velX * deltaSec,
  );
  nextMotion.offsetY = wrapSigned(
    nextMotion.offsetY + nextMotion.velY * deltaSec,
  );
  nextMotion.tiltX +=
    (nextMotion.targetTiltX - nextMotion.tiltX) *
    PHRASE_CLOUD_MOTION_CONFIG.tiltLerp;
  nextMotion.tiltY +=
    (nextMotion.targetTiltY - nextMotion.tiltY) *
    PHRASE_CLOUD_MOTION_CONFIG.tiltLerp;

  const minOpacity = PHRASE_CLOUD_MOTION_CONFIG.baseOpacity;
  const maxOpacity = PHRASE_CLOUD_MOTION_CONFIG.maxOpacity;
  const scaleSpan =
    PHRASE_CLOUD_MOTION_CONFIG.scaleMax - PHRASE_CLOUD_MOTION_CONFIG.scaleMin;
  const renders = seeds.map((seed) => {
    const loopU = wrapSigned(seed.u + nextMotion.offsetX);
    const loopV = wrapSigned(seed.v + nextMotion.offsetY);
    const waveDepth =
      Math.sin(
        loopU * TWO_PI * PHRASE_CLOUD_MOTION_CONFIG.waveFreqX + seed.phaseX,
      ) *
      Math.cos(
        loopV * TWO_PI * PHRASE_CLOUD_MOTION_CONFIG.waveFreqY + seed.phaseY,
      );
    const tiltDepth =
      (-loopU * nextMotion.tiltY - loopV * nextMotion.tiltX) *
      PHRASE_CLOUD_MOTION_CONFIG.tiltToDepth;
    const z = clamp(
      waveDepth * PHRASE_CLOUD_MOTION_CONFIG.depthWaveMix + tiltDepth,
      -1,
      1,
    );
    const normalizedDepth = (z + 1) * 0.5;

    return {
      opacity: minOpacity + normalizedDepth * (maxOpacity - minOpacity),
      scale: PHRASE_CLOUD_MOTION_CONFIG.scaleMin + normalizedDepth * scaleSpan,
      x:
        layout.centerX +
        loopU * layout.width * PHRASE_CLOUD_MOTION_CONFIG.spreadX,
      y:
        layout.centerY +
        loopV * layout.height * PHRASE_CLOUD_MOTION_CONFIG.spreadY +
        z * PHRASE_CLOUD_MOTION_CONFIG.depthLiftPx,
      z,
    };
  });
  const renderBuffer = resolvePhraseCloudCollisions(renders, metrics);
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

export const resetPhraseCloudMotionPointerTarget = (motion: MotionState) => {
  return {
    ...motion,
    lastPointer: null,
    targetTiltX: 0,
    targetTiltY: 0,
  };
};

export const updatePhraseCloudMotionFromPointer = ({
  height,
  motion,
  pointerX,
  pointerY,
  width,
}: UpdatePhraseCloudMotionFromPointerParams) => {
  const nextMotion = {
    ...motion,
  };

  if (nextMotion.lastPointer) {
    const deltaX = pointerX - nextMotion.lastPointer.x;
    const deltaY = pointerY - nextMotion.lastPointer.y;
    nextMotion.torqueX = clamp(
      nextMotion.torqueX + deltaX * PHRASE_CLOUD_MOTION_CONFIG.pointerGainX,
      -PHRASE_CLOUD_MOTION_CONFIG.maxTorque,
      PHRASE_CLOUD_MOTION_CONFIG.maxTorque,
    );
    nextMotion.torqueY = clamp(
      nextMotion.torqueY + deltaY * PHRASE_CLOUD_MOTION_CONFIG.pointerGainY,
      -PHRASE_CLOUD_MOTION_CONFIG.maxTorque,
      PHRASE_CLOUD_MOTION_CONFIG.maxTorque,
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
    normalizedY * PHRASE_CLOUD_MOTION_CONFIG.tiltMax,
    -PHRASE_CLOUD_MOTION_CONFIG.tiltMax,
    PHRASE_CLOUD_MOTION_CONFIG.tiltMax,
  );
  nextMotion.targetTiltY = clamp(
    -normalizedX * PHRASE_CLOUD_MOTION_CONFIG.tiltMax,
    -PHRASE_CLOUD_MOTION_CONFIG.tiltMax,
    PHRASE_CLOUD_MOTION_CONFIG.tiltMax,
  );

  return nextMotion;
};
