import type { AssignmentHelpSectionId } from "../../../types/assignmentHelp";

export const ASSIGNMENT_HELP_SECTION_ORDER: readonly AssignmentHelpSectionId[] =
  ["intro", "chat", "timeLoss"];

export const ASSIGNMENT_HELP_SECTION_SCROLL_VH: Record<
  AssignmentHelpSectionId,
  number
> = {
  intro: 140,
  chat: 520,
  timeLoss: 130,
};
