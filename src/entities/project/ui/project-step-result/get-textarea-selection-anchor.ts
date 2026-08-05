import { InputRange } from "dom-input-range";

export type TextareaSelectionAnchor = {
  contextElement: HTMLTextAreaElement;
  getBoundingClientRect: () => DOMRect;
  subscribeToPositionUpdates: (listener: () => void) => () => void;
};

export const getTextareaSelectionAnchor = (
  textarea: HTMLTextAreaElement,
): TextareaSelectionAnchor | null => {
  if (textarea.selectionStart === textarea.selectionEnd) {
    return null;
  }

  const styleClone = InputRange.fromSelection(textarea).getStyleClone();

  return {
    contextElement: textarea,
    getBoundingClientRect: () =>
      InputRange.fromSelection(textarea).getBoundingClientRect(),
    subscribeToPositionUpdates: (listener) => {
      const handleUpdate = () => listener();

      styleClone.addEventListener("update", handleUpdate);

      return () => styleClone.removeEventListener("update", handleUpdate);
    },
  };
};
