import {
  type PointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  TIME_LOSS_PHRASES,
  mapTimeLossPhraseXToLayout,
  mapTimeLossPhraseYToLayout,
} from "../../../../constants";
import { clamp } from "../../../../utils";

type UseTimeLossPhraseMotionParams = {
  containerRef: RefObject<HTMLDivElement | null>;
  interactive: boolean;
};

type PhraseSeed = {
  phaseX: number;
  phaseY: number;
  u: number;
  v: number;
};

type PhraseMetrics = {
  h: number;
  w: number;
};

type PhraseRender = {
  opacity: number;
  scale: number;
  x: number;
  y: number;
  z: number;
};

type LayoutState = {
  centerX: number;
  centerY: number;
  height: number;
  width: number;
};

type MotionState = {
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

const TWO_PI = Math.PI * 2;
const FONT_SIZE = 30;

const MOTION_FIELD_CONFIG: MotionFieldConfig = {
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

// 값을 최소값과 최대값 사이로 맞춤

// 값을 -0.5부터 0.5 사이로 한 바퀴 돌려 맞춤
const wrapSigned = (value: number) => {
  const wrapped = (((value + 0.5) % 1) + 1) % 1;
  return wrapped - 0.5;
};

// 소수점 아래 값만 남김
const fract = (value: number) => {
  return value - Math.floor(value);
};

// 각 문구의 시작 위치와 흔들림 기준값을 만듦
const buildPhraseSeeds = (): PhraseSeed[] => {
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

// 문구 움직임의 시작 상태를 만듦
const createInitialMotionState = (): MotionState => {
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

// 문구 배치 계산에 쓸 빈 레이아웃 상태를 만듦
const createEmptyLayoutState = (): LayoutState => {
  return {
    centerX: 0,
    centerY: 0,
    height: 0,
    width: 0,
  };
};

// 문구 크기를 재기 전 기본 크기값을 만듦
const createDefaultMetrics = (count: number): PhraseMetrics[] => {
  return Array.from({ length: count }, () => ({
    h: FONT_SIZE * 1.4,
    w: FONT_SIZE * 4,
  }));
};

// 화면에 바로 그릴 수 있는 문구 상태값을 만듦
const createRenderBuffer = (count: number): PhraseRender[] => {
  return Array.from({ length: count }, () => ({
    opacity: MOTION_FIELD_CONFIG.baseOpacity,
    scale: 1,
    x: 0,
    y: 0,
    z: 0,
  }));
};

// time loss 문구 구름에 필요한 위치와 움직임 상태를 만듦
export const useTimeLossPhraseMotion = ({
  containerRef,
  interactive,
}: UseTimeLossPhraseMotionParams) => {
  const phraseRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const seeds = useMemo(() => buildPhraseSeeds(), []);
  const metricsRef = useRef<PhraseMetrics[]>(
    createDefaultMetrics(seeds.length),
  );
  const layoutRef = useRef<LayoutState>(createEmptyLayoutState());
  const motionRef = useRef<MotionState>(createInitialMotionState());
  const renderBufferRef = useRef<PhraseRender[]>(
    createRenderBuffer(seeds.length),
  );
  const frameRef = useRef<number | null>(null);
  const resizeFrameRef = useRef<number | null>(null);

  // 문구 구름이 움직일 수 있는 영역 크기를 다시 계산함
  const updateLayout = useCallback(() => {
    const containerEl = containerRef.current;
    if (!containerEl) {
      return false;
    }

    const rect = containerEl.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return false;
    }

    layoutRef.current = {
      centerX: rect.width / 2,
      centerY: rect.height / 2,
      height: rect.height,
      width: rect.width,
    };

    return true;
  }, [containerRef]);

  // 각 문구의 실제 너비와 높이를 다시 잼
  const measurePhraseMetrics = useCallback(() => {
    const metrics = metricsRef.current;
    for (let index = 0; index < seeds.length; index += 1) {
      const phraseEl = phraseRefs.current[index];
      const nextWidth = phraseEl
        ? Math.max(phraseEl.offsetWidth, FONT_SIZE * 4)
        : FONT_SIZE * 4;
      const nextHeight = phraseEl
        ? Math.max(phraseEl.offsetHeight, FONT_SIZE * 1.4)
        : FONT_SIZE * 1.4;

      metrics[index] = {
        h: nextHeight,
        w: nextWidth,
      };
    }
  }, [phraseRefs, seeds.length]);

  // 계산한 위치값을 실제 문구 DOM에 적용함
  const applyFrameStyles = useCallback(() => {
    const renderBuffer = renderBufferRef.current;
    for (let index = 0; index < renderBuffer.length; index += 1) {
      const phraseEl = phraseRefs.current[index];
      if (!phraseEl) {
        continue;
      }

      const render = renderBuffer[index];
      phraseEl.style.left = `${render.x}px`;
      phraseEl.style.top = `${render.y}px`;
      phraseEl.style.opacity = String(render.opacity);
      phraseEl.style.zIndex = String(100 + Math.round((render.z + 1) * 100));
      phraseEl.style.transform = `translate3d(-50%, -50%, 0) translate3d(0, ${(-render.z * 4).toFixed(2)}px, 0) scale(${render.scale})`;
    }
  }, [phraseRefs]);

  // 움직이지 않는 기본 문구 배치를 한 번 그림
  const renderStaticFrame = useCallback(() => {
    if (!updateLayout()) {
      return;
    }

    const layout = layoutRef.current;
    const renderBuffer = renderBufferRef.current;

    for (let index = 0; index < seeds.length; index += 1) {
      const seed = seeds[index];
      const render = renderBuffer[index];
      render.opacity = MOTION_FIELD_CONFIG.baseOpacity;
      render.scale = 1;
      render.x = layout.centerX + seed.u * layout.width * 1.05;
      render.y = layout.centerY + seed.v * layout.height * 1.05;
      render.z = 0;
    }

    applyFrameStyles();
  }, [applyFrameStyles, seeds, updateLayout]);

  // 겹친 문구끼리 너무 붙지 않도록 위치를 벌림
  const runCollisionPass = useCallback(() => {
    const renderBuffer = renderBufferRef.current;
    const metrics = metricsRef.current;

    for (let pass = 0; pass < MOTION_FIELD_CONFIG.collisionPasses; pass += 1) {
      for (let leftIndex = 0; leftIndex < renderBuffer.length; leftIndex += 1) {
        for (
          let rightIndex = leftIndex + 1;
          rightIndex < renderBuffer.length;
          rightIndex += 1
        ) {
          const left = renderBuffer[leftIndex];
          const right = renderBuffer[rightIndex];
          const leftMetric = metrics[leftIndex];
          const rightMetric = metrics[rightIndex];

          const dx = right.x - left.x;
          const dy = right.y - left.y;

          const minDx =
            ((leftMetric.w * left.scale + rightMetric.w * right.scale) * 0.5 +
              MOTION_FIELD_CONFIG.collisionPaddingX) *
            0.7;
          const minDy =
            ((leftMetric.h * left.scale + rightMetric.h * right.scale) * 0.5 +
              MOTION_FIELD_CONFIG.collisionPaddingY) *
            0.7;

          if (Math.abs(dx) >= minDx || Math.abs(dy) >= minDy) {
            continue;
          }

          const overlapX = minDx - Math.abs(dx);
          const overlapY = minDy - Math.abs(dy);
          const dirX =
            dx === 0 ? (leftIndex % 2 === 0 ? -1 : 1) : Math.sign(dx);
          const dirY =
            dy === 0 ? (leftIndex % 2 === 0 ? -1 : 1) : Math.sign(dy);

          const pushX = overlapX * 0.5 * dirX;
          const pushY = overlapY * 0.5 * dirY;

          right.x += pushX;
          left.x -= pushX;
          right.y += pushY;
          left.y -= pushY;
        }
      }
    }
  }, []);

  // 현재 시간과 움직임 상태를 기준으로 한 프레임을 계산함
  const computeAnimatedFrame = useCallback(
    (timestamp: number) => {
      const layout = layoutRef.current;
      if (layout.width <= 0 || layout.height <= 0) {
        return;
      }

      const motion = motionRef.current;
      const renderBuffer = renderBufferRef.current;

      const deltaSecRaw =
        motion.lastTimestamp === 0
          ? 1 / 60
          : (timestamp - motion.lastTimestamp) / 1000;
      const deltaSec = clamp(deltaSecRaw, 1 / 240, 1 / 20);
      motion.lastTimestamp = timestamp;

      motion.torqueX *= MOTION_FIELD_CONFIG.torqueDecay;
      motion.torqueY *= MOTION_FIELD_CONFIG.torqueDecay;

      const pointerDrivenVelX =
        motion.targetTiltY * MOTION_FIELD_CONFIG.positionDirectionGainX;
      const pointerDrivenVelY =
        -motion.targetTiltX * MOTION_FIELD_CONFIG.positionDirectionGainY;

      motion.velX =
        (motion.velX + motion.torqueX + pointerDrivenVelX) *
          MOTION_FIELD_CONFIG.friction +
        MOTION_FIELD_CONFIG.baseVelX;
      motion.velY =
        (motion.velY + motion.torqueY + pointerDrivenVelY) *
          MOTION_FIELD_CONFIG.friction +
        MOTION_FIELD_CONFIG.baseVelY;

      motion.velX = clamp(
        motion.velX,
        -MOTION_FIELD_CONFIG.maxVel,
        MOTION_FIELD_CONFIG.maxVel,
      );
      motion.velY = clamp(
        motion.velY,
        -MOTION_FIELD_CONFIG.maxVel,
        MOTION_FIELD_CONFIG.maxVel,
      );

      motion.offsetX = wrapSigned(motion.offsetX + motion.velX * deltaSec);
      motion.offsetY = wrapSigned(motion.offsetY + motion.velY * deltaSec);

      motion.tiltX +=
        (motion.targetTiltX - motion.tiltX) * MOTION_FIELD_CONFIG.tiltLerp;
      motion.tiltY +=
        (motion.targetTiltY - motion.tiltY) * MOTION_FIELD_CONFIG.tiltLerp;

      const minOpacity = MOTION_FIELD_CONFIG.baseOpacity;
      const maxOpacity = MOTION_FIELD_CONFIG.maxOpacity;
      const scaleSpan =
        MOTION_FIELD_CONFIG.scaleMax - MOTION_FIELD_CONFIG.scaleMin;

      for (let index = 0; index < seeds.length; index += 1) {
        const seed = seeds[index];
        const loopU = wrapSigned(seed.u + motion.offsetX);
        const loopV = wrapSigned(seed.v + motion.offsetY);

        const waveDepth =
          Math.sin(
            loopU * TWO_PI * MOTION_FIELD_CONFIG.waveFreqX + seed.phaseX,
          ) *
          Math.cos(
            loopV * TWO_PI * MOTION_FIELD_CONFIG.waveFreqY + seed.phaseY,
          );

        const tiltDepth =
          (-loopU * motion.tiltY - loopV * motion.tiltX) *
          MOTION_FIELD_CONFIG.tiltToDepth;
        const z = clamp(
          waveDepth * MOTION_FIELD_CONFIG.depthWaveMix + tiltDepth,
          -1,
          1,
        );
        const normalizedDepth = (z + 1) * 0.5;
        const render = renderBuffer[index];

        render.opacity =
          minOpacity + normalizedDepth * (maxOpacity - minOpacity);
        render.scale =
          MOTION_FIELD_CONFIG.scaleMin + normalizedDepth * scaleSpan;
        render.x =
          layout.centerX + loopU * layout.width * MOTION_FIELD_CONFIG.spreadX;
        render.y =
          layout.centerY +
          loopV * layout.height * MOTION_FIELD_CONFIG.spreadY +
          z * MOTION_FIELD_CONFIG.depthLiftPx;
        render.z = z;
      }

      runCollisionPass();

      const marginX = layout.width * 0.16;
      const marginY = layout.height * 0.16;
      for (let index = 0; index < renderBuffer.length; index += 1) {
        const render = renderBuffer[index];
        render.x = clamp(render.x, -marginX, layout.width + marginX);
        render.y = clamp(render.y, -marginY, layout.height + marginY);
      }

      applyFrameStyles();
    },
    [applyFrameStyles, runCollisionPass, seeds],
  );

  // 문구 움직임 루프를 멈춤
  const stopFrameLoop = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  // 포인터 움직임에 맞춰 문구 기울기와 힘을 바꿈
  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!interactive) {
        return;
      }

      const motion = motionRef.current;
      const pointerX = event.nativeEvent.offsetX;
      const pointerY = event.nativeEvent.offsetY;

      if (motion.lastPointer) {
        const deltaX = pointerX - motion.lastPointer.x;
        const deltaY = pointerY - motion.lastPointer.y;
        motion.torqueX = clamp(
          motion.torqueX + deltaX * MOTION_FIELD_CONFIG.pointerGainX,
          -MOTION_FIELD_CONFIG.maxTorque,
          MOTION_FIELD_CONFIG.maxTorque,
        );
        motion.torqueY = clamp(
          motion.torqueY + deltaY * MOTION_FIELD_CONFIG.pointerGainY,
          -MOTION_FIELD_CONFIG.maxTorque,
          MOTION_FIELD_CONFIG.maxTorque,
        );
      }

      motion.lastPointer = {
        x: pointerX,
        y: pointerY,
      };

      const { width, height } = layoutRef.current;
      if (width <= 0 || height <= 0) {
        return;
      }

      const normalizedX = (pointerX / width - 0.5) * 2;
      const normalizedY = (pointerY / height - 0.5) * 2;
      motion.targetTiltX = clamp(
        normalizedY * MOTION_FIELD_CONFIG.tiltMax,
        -MOTION_FIELD_CONFIG.tiltMax,
        MOTION_FIELD_CONFIG.tiltMax,
      );
      motion.targetTiltY = clamp(
        -normalizedX * MOTION_FIELD_CONFIG.tiltMax,
        -MOTION_FIELD_CONFIG.tiltMax,
        MOTION_FIELD_CONFIG.tiltMax,
      );
    },
    [interactive],
  );

  // 포인터가 나가면 기울기 값을 다시 원래대로 돌림
  const handlePointerLeave = useCallback(() => {
    const motion = motionRef.current;
    motion.lastPointer = null;
    motion.targetTiltX = 0;
    motion.targetTiltY = 0;
  }, []);

  useEffect(() => {
    updateLayout();
    measurePhraseMetrics();
    renderStaticFrame();
  }, [measurePhraseMetrics, renderStaticFrame, updateLayout]);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (resizeFrameRef.current !== null) {
        return;
      }

      resizeFrameRef.current = window.requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        updateLayout();
        measurePhraseMetrics();
      });
    });

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
    };
  }, [containerRef, measurePhraseMetrics, updateLayout]);

  useEffect(() => {
    updateLayout();
    measurePhraseMetrics();

    if (!interactive) {
      const motion = motionRef.current;
      motion.lastPointer = null;
      motion.targetTiltX = 0;
      motion.targetTiltY = 0;
    }

    const animate = (timestamp: number) => {
      computeAnimatedFrame(timestamp);
      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);
    return () => {
      stopFrameLoop();
    };
  }, [
    computeAnimatedFrame,
    interactive,
    measurePhraseMetrics,
    stopFrameLoop,
    updateLayout,
  ]);

  useEffect(() => {
    return () => {
      stopFrameLoop();

      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
      }
    };
  }, [stopFrameLoop]);

  return {
    baseOpacity: MOTION_FIELD_CONFIG.baseOpacity,
    handlePointerLeave,
    handlePointerMove,
    phraseRefs,
  };
};
