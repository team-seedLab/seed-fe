import { useEffect, useRef, useState } from "react";

import { resolveProgressUnits } from "../../../utils";

// 트리거 요소의 위치를 실행 섹션 진행값으로 바꿈
export const useSolutionTimelineProgress = (isActivated: boolean) => {
  const progressTriggerRef = useRef<HTMLParagraphElement | null>(null);
  const [progressUnits, setProgressUnits] = useState(0);

  useEffect(() => {
    if (!isActivated) {
      return;
    }

    let frameId: number | null = null;

    // 트리거 요소 위치를 읽어서 현재 진행값을 계산함
    const calculate = () => {
      const triggerNode = progressTriggerRef.current;
      if (!triggerNode) {
        setProgressUnits(0);
        return;
      }

      const rect = triggerNode.getBoundingClientRect();
      const triggerCenterY = rect.top + rect.height * 0.5;
      const viewportCenterY = window.innerHeight * 0.5;
      const nextProgressUnits = resolveProgressUnits({
        isActivated,
        distancePx: viewportCenterY - triggerCenterY,
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
    progressTriggerRef,
    progressUnits: isActivated ? progressUnits : 0,
  };
};
