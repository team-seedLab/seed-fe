import { type FocusEvent, useState } from "react";

import {
  type TextareaSelectionAnchor,
  getTextareaSelectionAnchor,
} from "./get-textarea-selection-anchor";

export const useProjectStepResultSelection = () => {
  const [selectionAnchor, setSelectionAnchor] =
    useState<TextareaSelectionAnchor | null>(null);

  const updateTextSelection = (textarea: HTMLTextAreaElement) => {
    setSelectionAnchor(getTextareaSelectionAnchor(textarea));
  };

  const clearTextSelection = () => {
    setSelectionAnchor(null);
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
    selectionAnchor,
    updateTextSelection,
  };
};
