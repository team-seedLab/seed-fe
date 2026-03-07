import { type RefObject, useEffect, useState } from "react";

import { ASSIGNMENT_HELP_SECTION_ORDER } from "../../../../constants";
import type {
  AssignmentHelpSectionId,
  AssignmentHelpSectionProgressMap,
} from "../../../../types";
import { clamp01 } from "../../../../utils";

// 모든 구간의 시작 진행도를 0으로 만든 상태값을 만듦
const createZeroProgressMap = (): AssignmentHelpSectionProgressMap => {
  return {
    intro: 0,
    chat: 0,
    timeLoss: 0,
  };
};

// 한 구간의 스크롤 진행도를 0부터 1 사이 값으로 계산함
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

// 이전 진행도와 새 진행도가 같은지 확인함
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

// 각 구간 ref를 기준으로 현재 스크롤 진행도를 구함
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
