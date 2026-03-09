import type { AssignmentHelpSectionId } from "../../types";

export {
  ASSIGNMENT_HELP_CHAT_PHASES,
  ASSIGNMENT_HELP_COPY,
} from "./assignmentHelpStoryData";
export {
  mapTimeLossPhraseXToLayout,
  mapTimeLossPhraseYToLayout,
  TIME_LOSS_PHRASE_BASE_TONE,
  TIME_LOSS_PHRASES,
  type TimeLossPhrase,
} from "./timeLossPhraseData";

export const ASSIGNMENT_HELP_SECTION_SCROLL_VH: Record<
  AssignmentHelpSectionId,
  number
> = {
  intro: 50,
  chat: 300,
  timeLoss: 160,
};
