import { type FocusEvent, useState } from "react";

export const useProjectStepResultSelection = () => {
  const [hasTextSelection, setHasTextSelection] = useState(false);

  const updateTextSelection = (textarea: HTMLTextAreaElement) => {
    setHasTextSelection(textarea.selectionStart < textarea.selectionEnd);
  };

  const clearTextSelection = () => {
    setHasTextSelection(false);
  };

  const handleSelectionScopeBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (
      nextFocusedElement instanceof Node &&
      event.currentTarget.contains(nextFocusedElement)
    ) {
      return;
    }

    clearTextSelection();
  };

  return {
    clearTextSelection,
    handleSelectionScopeBlur,
    hasTextSelection,
    updateTextSelection,
  };
};
