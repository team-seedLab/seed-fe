import { useEffect, useEffectEvent, useRef } from "react";

export type ContentPageExitSaveHandler = (
  content: string,
) => Promise<void> | void;

type Params = {
  editorKey: string;
  cancelPendingSaves: (targetKey: string) => void;
  flushContent: (targetKey: string) => void;
  getUnsavedContent: (targetKey: string) => string | null;
  onSaveBeforePageExit?: ContentPageExitSaveHandler;
};

export const useUploadContentPageExit = ({
  editorKey,
  cancelPendingSaves,
  flushContent,
  getUnsavedContent,
  onSaveBeforePageExit,
}: Params) => {
  const pageExitSaveHandlerByKeyRef = useRef<
    Record<string, ContentPageExitSaveHandler | undefined>
  >({});

  useEffect(() => {
    pageExitSaveHandlerByKeyRef.current[editorKey] = onSaveBeforePageExit;
  }, [editorKey, onSaveBeforePageExit]);

  const saveBeforePageExit = useEffectEvent((targetKey: string) => {
    const unsavedContent = getUnsavedContent(targetKey);
    const saveHandler = pageExitSaveHandlerByKeyRef.current[targetKey];

    if (unsavedContent === null || !saveHandler) {
      return;
    }

    cancelPendingSaves(targetKey);
    void saveHandler(unsavedContent);
  });
  const saveBeforeScreenExit = useEffectEvent((targetKey: string) => {
    flushContent(targetKey);
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
