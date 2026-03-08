import type { AssignmentHelpSectionId } from "../../../../types";

// 과제 도와줘 섹션이 어떤 순서로 이어지는지 정함
export const ASSIGNMENT_HELP_SECTION_ORDER: readonly AssignmentHelpSectionId[] =
  ["intro", "chat", "timeLoss"];

// 각 구간이 몇 vh만큼 스크롤되는지 정함
export const ASSIGNMENT_HELP_SECTION_SCROLL_VH: Record<
  AssignmentHelpSectionId,
  number
> = {
  intro: 50,
  chat: 300,
  timeLoss: 160,
};
