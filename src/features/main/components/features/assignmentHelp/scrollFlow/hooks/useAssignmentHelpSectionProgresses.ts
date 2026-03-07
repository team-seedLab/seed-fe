import { type RefObject, useEffect, useState } from "react";

import type {
  AssignmentHelpSectionId,
  AssignmentHelpSectionProgressMap,
} from "../../types/assignmentHelp";
import { ASSIGNMENT_HELP_SECTION_ORDER } from "../constants/sectionScrollConfig";
import { clamp01 } from "../utils/progressMath";

const createZeroProgressMap = (): AssignmentHelpSectionProgressMap => {
  return {
    intro: 0,
    chat: 0,
    timeLoss: 0,
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
  left: AssignmentHelpSectionProgressMap,
  right: AssignmentHelpSectionProgressMap,
) => {
  return ASSIGNMENT_HELP_SECTION_ORDER.every((sectionId) => {
    return Math.abs(left[sectionId] - right[sectionId]) < 0.0001;
  });
};

export type AssignmentHelpSectionRefs = Record<
  AssignmentHelpSectionId,
  RefObject<HTMLElement | null>
>;

export const useAssignmentHelpSectionProgresses = (
  sectionRefs: AssignmentHelpSectionRefs,
) => {
  const [progresses, setProgresses] =
    useState<AssignmentHelpSectionProgressMap>(createZeroProgressMap);

  useEffect(() => {
    let frameId: number | null = null;

    const calculate = () => {
      const nextProgress =
        ASSIGNMENT_HELP_SECTION_ORDER.reduce<AssignmentHelpSectionProgressMap>(
          (acc, sectionId) => {
            acc[sectionId] = calculateSectionProgress(
              sectionRefs[sectionId].current,
            );
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
