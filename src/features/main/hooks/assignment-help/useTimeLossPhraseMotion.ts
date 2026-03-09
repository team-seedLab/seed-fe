import {
  type PointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  type LayoutState,
  type MotionState,
  type PhraseMetrics,
  type PhraseRender,
  TIME_LOSS_PHRASE_FONT_SIZE,
  TIME_LOSS_PHRASE_MOTION_CONFIG,
  buildTimeLossPhraseSeeds,
  computeNextTimeLossPhraseFrame,
  computeStaticTimeLossPhraseRenderBuffer,
  createDefaultTimeLossPhraseMetrics,
  createEmptyTimeLossLayoutState,
  createInitialTimeLossMotionState,
  createInitialTimeLossPhraseRenderBuffer,
  createTimeLossLayoutState,
  resetTimeLossMotionPointerTarget,
  updateTimeLossMotionFromPointer,
} from "../../utils";

type UseTimeLossPhraseMotionParams = {
  containerRef: RefObject<HTMLDivElement | null>;
  interactive: boolean;
};

export const useTimeLossPhraseMotion = ({
  containerRef,
  interactive,
}: UseTimeLossPhraseMotionParams) => {
  const phraseRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const seeds = useMemo(() => buildTimeLossPhraseSeeds(), []);
  const metricsRef = useRef<PhraseMetrics[]>(
    createDefaultTimeLossPhraseMetrics(seeds.length),
  );
  const layoutRef = useRef<LayoutState>(createEmptyTimeLossLayoutState());
  const motionRef = useRef<MotionState>(createInitialTimeLossMotionState());
  const renderBufferRef = useRef<PhraseRender[]>(
    createInitialTimeLossPhraseRenderBuffer(seeds.length),
  );
  const frameRef = useRef<number | null>(null);
  const resizeFrameRef = useRef<number | null>(null);

  const updateLayout = useCallback(() => {
    const containerEl = containerRef.current;
    if (!containerEl) {
      return false;
    }

    const rect = containerEl.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return false;
    }

    layoutRef.current = createTimeLossLayoutState(rect.width, rect.height);
    return true;
  }, [containerRef]);

  const measurePhraseMetrics = useCallback(() => {
    const metrics = metricsRef.current;

    for (let index = 0; index < seeds.length; index += 1) {
      const phraseEl = phraseRefs.current[index];
      metrics[index] = {
        h: phraseEl
          ? Math.max(phraseEl.offsetHeight, TIME_LOSS_PHRASE_FONT_SIZE * 1.4)
          : TIME_LOSS_PHRASE_FONT_SIZE * 1.4,
        w: phraseEl
          ? Math.max(phraseEl.offsetWidth, TIME_LOSS_PHRASE_FONT_SIZE * 4)
          : TIME_LOSS_PHRASE_FONT_SIZE * 4,
      };
    }
  }, [seeds.length]);

  const applyFrameStyles = useCallback(() => {
    for (let index = 0; index < renderBufferRef.current.length; index += 1) {
      const phraseEl = phraseRefs.current[index];
      if (!phraseEl) {
        continue;
      }

      const render = renderBufferRef.current[index];
      phraseEl.style.left = `${render.x}px`;
      phraseEl.style.top = `${render.y}px`;
      phraseEl.style.opacity = String(render.opacity);
      phraseEl.style.zIndex = String(100 + Math.round((render.z + 1) * 100));
      phraseEl.style.transform = `translate3d(-50%, -50%, 0) translate3d(0, ${(-render.z * 4).toFixed(2)}px, 0) scale(${render.scale})`;
    }
  }, []);

  const renderStaticFrame = useCallback(() => {
    if (!updateLayout()) {
      return;
    }

    renderBufferRef.current = computeStaticTimeLossPhraseRenderBuffer(
      layoutRef.current,
      seeds,
    );
    applyFrameStyles();
  }, [applyFrameStyles, seeds, updateLayout]);

  const stopFrameLoop = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!interactive) {
        return;
      }

      motionRef.current = updateTimeLossMotionFromPointer({
        height: layoutRef.current.height,
        motion: motionRef.current,
        pointerX: event.nativeEvent.offsetX,
        pointerY: event.nativeEvent.offsetY,
        width: layoutRef.current.width,
      });
    },
    [interactive],
  );

  const handlePointerLeave = useCallback(() => {
    motionRef.current = resetTimeLossMotionPointerTarget(motionRef.current);
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
      motionRef.current = resetTimeLossMotionPointerTarget(motionRef.current);
    }

    const animate = (timestamp: number) => {
      const nextFrame = computeNextTimeLossPhraseFrame({
        layout: layoutRef.current,
        metrics: metricsRef.current,
        motion: motionRef.current,
        seeds,
        timestamp,
      });

      motionRef.current = nextFrame.motion;
      renderBufferRef.current = nextFrame.renderBuffer;
      applyFrameStyles();
      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);
    return () => {
      stopFrameLoop();
    };
  }, [
    applyFrameStyles,
    interactive,
    measurePhraseMetrics,
    seeds,
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
    baseOpacity: TIME_LOSS_PHRASE_MOTION_CONFIG.baseOpacity,
    handlePointerLeave,
    handlePointerMove,
    phraseRefs,
  };
};
