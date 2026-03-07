import { type RefObject, useMemo, useRef } from "react";

import type { AssignmentHelpState } from "../../types/assignmentHelp";
import { deriveAssignmentHelpState } from "../deriveAssignmentHelpState";

import {
  type AssignmentHelpSectionRefs,
  useAssignmentHelpSectionProgresses,
} from "./useAssignmentHelpSectionProgresses";

export type AssignmentHelpSectionState = {
  assignmentHelpState: AssignmentHelpState;
  chatRef: RefObject<HTMLDivElement | null>;
  introRef: RefObject<HTMLDivElement | null>;
  timeLossSceneRef: RefObject<HTMLDivElement | null>;
};

export const useAssignmentHelpSectionState = (): AssignmentHelpSectionState => {
  const introRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const timeLossSceneRef = useRef<HTMLDivElement | null>(null);

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
