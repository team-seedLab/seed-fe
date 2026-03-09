import type { AssignmentHelpSectionId } from "../../types";

export {
  ASSIGNMENT_HELP_COPY,
  ASSIGNMENT_HELP_MESSAGE_BANK,
} from "./assignmentHelpStoryData";
export {
  mapTimeLossPhraseXToLayout,
  mapTimeLossPhraseYToLayout,
  TIME_LOSS_PHRASE_BASE_TONE,
  TIME_LOSS_PHRASES,
  type TimeLossPhrase,
} from "./timeLossScene";

export const ASSIGNMENT_HELP_SECTION_ORDER: readonly AssignmentHelpSectionId[] =
  ["intro", "chat", "timeLoss"];

export const ASSIGNMENT_HELP_SECTION_SCROLL_VH: Record<
  AssignmentHelpSectionId,
  number
> = {
  intro: 50,
  chat: 300,
  timeLoss: 160,
};
