import { InputRange } from "dom-input-range";

export type TextareaSelectionAnchor = {
  contextElement: HTMLTextAreaElement;
  getBoundingClientRect: () => DOMRect;
};

export const getTextareaSelectionAnchor = (
  textarea: HTMLTextAreaElement,
): TextareaSelectionAnchor | null => {
  if (textarea.selectionStart === textarea.selectionEnd) {
    return null;
  }

  return {
    contextElement: textarea,
    getBoundingClientRect: () =>
      InputRange.fromSelection(textarea).getBoundingClientRect(),
  };
};
