import { type RefObject, useMemo, useRef } from "react";

import type { AssignmentHelpState } from "../../../types";
import { deriveAssignmentHelpState } from "../../../utils";

import {
  type AssignmentHelpSectionRefs,
  useAssignmentHelpSectionProgresses,
} from "./sectionProgress";

export type AssignmentHelpSectionState = {
  assignmentHelpState: AssignmentHelpState;
  chatRef: RefObject<HTMLDivElement | null>;
  introRef: RefObject<HTMLDivElement | null>;
  timeLossSceneRef: RefObject<HTMLDivElement | null>;
};

// 과제 도와줘 섹션에 필요한 ref와 상태값을 한 번에 만듦
export const useAssignmentHelpSectionState = (): AssignmentHelpSectionState => {
  const introRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const timeLossSceneRef = useRef<HTMLDivElement | null>(null);

  // 각 구간 ref를 진행도 계산에 쓸 수 있는 형태로 묶음
  const sectionRefs = useMemo<AssignmentHelpSectionRefs>(() => {
    return {
      intro: introRef as RefObject<HTMLElement | null>,
      chat: chatRef as RefObject<HTMLElement | null>,
      timeLoss: timeLossSceneRef as RefObject<HTMLElement | null>,
    };
  }, []);

  const sectionProgresses = useAssignmentHelpSectionProgresses(sectionRefs);
  const assignmentHelpState = useMemo(() => {
    return deriveAssignmentHelpState(sectionProgresses);
  }, [sectionProgresses]);

  return {
    assignmentHelpState,
    chatRef,
    introRef,
    timeLossSceneRef,
  };
};
