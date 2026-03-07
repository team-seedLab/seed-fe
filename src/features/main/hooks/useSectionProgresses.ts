import { type RefObject, useEffect, useState } from "react";

import {
  STORY_SECTION_ORDER,
  type StorySectionId,
  type StorySectionProgressMap,
} from "../constants/storySections";

const clamp01 = (value: number) => {
  return Math.min(1, Math.max(0, value));
};

const createZeroProgressMap = (): StorySectionProgressMap => {
  return {
    intro: 0,
    chat: 0,
    next: 0,
  };
};

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

const isProgressMapEqual = (
  left: StorySectionProgressMap,
  right: StorySectionProgressMap,
) => {
  return STORY_SECTION_ORDER.every((id) => {
    return Math.abs(left[id] - right[id]) < 0.0001;
  });
};

export type StorySectionRefs = Record<
  StorySectionId,
  RefObject<HTMLElement | null>
>;

export const useSectionProgresses = (sectionRefs: StorySectionRefs) => {
  const [progresses, setProgresses] = useState<StorySectionProgressMap>(
    createZeroProgressMap,
  );

  useEffect(() => {
    let frameId: number | null = null;

    const calculate = () => {
      const nextProgress = STORY_SECTION_ORDER.reduce<StorySectionProgressMap>(
        (acc, id) => {
          acc[id] = calculateSectionProgress(sectionRefs[id].current);
          return acc;
        },
        createZeroProgressMap(),
      );

      setProgresses((current) => {
        if (isProgressMapEqual(current, nextProgress)) {
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
