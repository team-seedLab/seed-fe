import { useEffect, useRef, useState } from "react";

import { resolveSceneProgressUnits } from "../utils";

// 실행 섹션 루트의 위치를 sticky 구간 진행값으로 바꿈
export const useSolutionTimelineProgress = (isActivated: boolean) => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [progressUnits, setProgressUnits] = useState(0);

  useEffect(() => {
    if (!isActivated) {
      return;
    }

    let frameId: number | null = null;

    // 섹션 루트의 위치를 읽어서 sticky 구간 진행값을 계산함
    const calculate = () => {
      const sceneNode = sceneRef.current;

      if (!sceneNode) {
        setProgressUnits(0);
        return;
      }

      const rect = sceneNode.getBoundingClientRect();
      const nextProgressUnits = resolveSceneProgressUnits({
        isActivated,
        sceneHeight: rect.height,
        sceneTop: rect.top,
        viewportHeight: window.innerHeight,
      });
      setProgressUnits(nextProgressUnits);
    };

    // 스크롤 계산을 다음 프레임으로 모아서 한 번만 실행함
    const schedule = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        calculate();
      });
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isActivated]);

  return {
    sceneRef,
    progressUnits: isActivated ? progressUnits : 0,
  };
};
