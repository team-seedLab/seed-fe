import { useEffect, useRef } from "react";

type Params = {
  closeDiff: () => void;
  focusRequestId: number | null;
  isDiffVisible: boolean;
};

export const usePromptCardEditorFocus = ({
  closeDiff,
  focusRequestId,
  isDiffVisible,
}: Params) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const handledFocusRequestIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      focusRequestId === null ||
      handledFocusRequestIdRef.current === focusRequestId
    ) {
      return;
    }

    if (isDiffVisible) {
      closeDiff();
      return;
    }

    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.scrollIntoView({ behavior: "smooth", block: "center" });
    editor.focus({ preventScroll: true });
    handledFocusRequestIdRef.current = focusRequestId;
  }, [closeDiff, focusRequestId, isDiffVisible]);

  return editorRef;
};
