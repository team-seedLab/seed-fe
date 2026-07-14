import { useEffect, useEffectEvent, useRef } from "react";

export type PromptPageExitSaveHandler = (
  editedPrompt: string,
) => Promise<void> | void;

type Params = {
  editorKey: string;
  cancelPendingSaves: (targetKey: string) => void;
  flushPrompt: (targetKey: string) => void;
  getUnsavedPrompt: (targetKey: string) => string | null;
  onSaveBeforePageExit?: PromptPageExitSaveHandler;
};

export const useUploadPromptPageExit = ({
  editorKey,
  cancelPendingSaves,
  flushPrompt,
  getUnsavedPrompt,
  onSaveBeforePageExit,
}: Params) => {
  const pageExitSaveHandlerByKeyRef = useRef<
    Record<string, PromptPageExitSaveHandler | undefined>
  >({});

  useEffect(() => {
    pageExitSaveHandlerByKeyRef.current[editorKey] = onSaveBeforePageExit;
  }, [editorKey, onSaveBeforePageExit]);

  const saveBeforePageExit = useEffectEvent((targetKey: string) => {
    const unsavedPrompt = getUnsavedPrompt(targetKey);
    const saveHandler = pageExitSaveHandlerByKeyRef.current[targetKey];

    if (unsavedPrompt === null || !saveHandler) {
      return;
    }

    cancelPendingSaves(targetKey);
    void saveHandler(unsavedPrompt);
  });
  const saveBeforeScreenExit = useEffectEvent((targetKey: string) => {
    flushPrompt(targetKey);
  });

  useEffect(() => {
    const targetKey = editorKey;
    let isPageExiting = false;
    const handlePageHide = () => {
      isPageExiting = true;
      saveBeforePageExit(targetKey);
    };
    const handlePageShow = () => {
      isPageExiting = false;
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);

      if (!isPageExiting) {
        saveBeforeScreenExit(targetKey);
      }
    };
  }, [editorKey]);
};
