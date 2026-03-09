import { type RefObject, useEffect, useState } from "react";

import type {
  AssignmentHelpSectionId,
  AssignmentHelpSectionProgressMap,
} from "../../../../types";
import { clamp01 } from "../../../../utils";

// 각 섹션의 진행도를 계산하는 로직
const calculateSectionProgress = (section: HTMLElement | null) => {
  if (!section) {
    return 0;
  }

  const rect = section.getBoundingClientRect();
  const travel = rect.height - window.innerHeight;

  if (travel <= 1) {
    return rect.top <= 0 ? 1 : 0;
  }

  return clamp01(-rect.top / travel);
};

export type AssignmentHelpSectionRefs = Record<
  AssignmentHelpSectionId,
  RefObject<HTMLElement | null>
>;

// 각 섹션 진행도 실시간 계산 및 반환하는 훅
export const useAssignmentHelpSectionProgresses = (
  sectionRefs: AssignmentHelpSectionRefs,
) => {
  const [progresses, setProgresses] =
    useState<AssignmentHelpSectionProgressMap>({
      intro: 0,
      chat: 0,
      timeLoss: 0,
    });

  useEffect(() => {
    let frameId: number | null = null;

    const calculate = () => {
      const nextProgress: AssignmentHelpSectionProgressMap = {
        intro: calculateSectionProgress(sectionRefs.intro.current),
        chat: calculateSectionProgress(sectionRefs.chat.current),
        timeLoss: calculateSectionProgress(sectionRefs.timeLoss.current),
      };

      setProgresses((current) => {
        const isSame =
          Math.abs(current.intro - nextProgress.intro) < 0.0001 &&
          Math.abs(current.chat - nextProgress.chat) < 0.0001 &&
          Math.abs(current.timeLoss - nextProgress.timeLoss) < 0.0001;

        if (isSame) {
          return current;
        }

        return nextProgress;
      });
    };

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
  }, [sectionRefs]);

  return progresses;
};
