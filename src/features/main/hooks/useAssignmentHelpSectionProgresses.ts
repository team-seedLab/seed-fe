import { type RefObject, useEffect, useState } from "react";

import type {
  AssignmentHelpSectionId,
  AssignmentHelpSectionProgressMap,
} from "../types";
import { calculateAssignmentHelpSectionProgress } from "../utils";

export type AssignmentHelpSectionRefs = Record<
  AssignmentHelpSectionId,
  RefObject<HTMLElement | null>
>;
// 과제 도와줘 섹션 스크롤 진행도 측정
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
      const introRect =
        sectionRefs.intro.current?.getBoundingClientRect() ?? null;
      const chatRect =
        sectionRefs.chat.current?.getBoundingClientRect() ?? null;
      const timeLossRect =
        sectionRefs.timeLoss.current?.getBoundingClientRect() ?? null;
      const nextProgress: AssignmentHelpSectionProgressMap = {
        intro: introRect
          ? calculateAssignmentHelpSectionProgress({
              height: introRect.height,
              top: introRect.top,
              viewportHeight: window.innerHeight,
            })
          : 0,
        chat: chatRect
          ? calculateAssignmentHelpSectionProgress({
              height: chatRect.height,
              top: chatRect.top,
              viewportHeight: window.innerHeight,
            })
          : 0,
        timeLoss: timeLossRect
          ? calculateAssignmentHelpSectionProgress({
              height: timeLossRect.height,
              top: timeLossRect.top,
              viewportHeight: window.innerHeight,
            })
          : 0,
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
