import { useEffect, useEffectEvent, useRef } from "react";

export type PromptSaveHandler = (editedPrompt: string) => Promise<void> | void;

type Params = {
  editorKey: string;
  initialPrompt: string;
  onSave?: PromptSaveHandler;
  onSaveBeforePageExit?: PromptSaveHandler;
};

export const useUploadPromptSaveQueue = ({
  editorKey,
  initialPrompt,
  onSave,
  onSaveBeforePageExit,
}: Params) => {
  const currentPromptByKeyRef = useRef<Record<string, string>>({});
  const initialPromptByKeyRef = useRef<Record<string, string>>({});
  const lastCommittedPromptByKeyRef = useRef<Record<string, string>>({});
  const pendingPromptByKeyRef = useRef<Record<string, string>>({});
  const saveQueueByKeyRef = useRef<Record<string, Promise<void>>>({});
  const onSaveByKeyRef = useRef<Record<string, PromptSaveHandler | undefined>>(
    {},
  );
  const onSaveBeforePageExitByKeyRef = useRef<
    Record<string, PromptSaveHandler | undefined>
  >({});

  initialPromptByKeyRef.current[editorKey] = initialPrompt;
  onSaveByKeyRef.current[editorKey] = onSave;
  onSaveBeforePageExitByKeyRef.current[editorKey] = onSaveBeforePageExit;

  const setCurrentPrompt = (content: string) => {
    currentPromptByKeyRef.current[editorKey] = content;
  };

  const commitPromptForKey = async (targetKey: string, content: string) => {
    const initialPromptForKey = initialPromptByKeyRef.current[targetKey] ?? "";
    const lastCommittedPrompt =
      lastCommittedPromptByKeyRef.current[targetKey] ?? initialPromptForKey;
    const hasPendingSave = saveQueueByKeyRef.current[targetKey] !== undefined;

    if (
      (!hasPendingSave && content === lastCommittedPrompt) ||
      pendingPromptByKeyRef.current[targetKey] === content
    ) {
      return false;
    }

    pendingPromptByKeyRef.current[targetKey] = content;
    const previousSave =
      saveQueueByKeyRef.current[targetKey] ?? Promise.resolve();
    const savePromise = previousSave
      .catch(() => undefined)
      .then(async () => {
        await onSaveByKeyRef.current[targetKey]?.(content);
      });
    saveQueueByKeyRef.current[targetKey] = savePromise;

    try {
      await savePromise;
      lastCommittedPromptByKeyRef.current[targetKey] = content;
      return true;
    } catch {
      return false;
    } finally {
      if (saveQueueByKeyRef.current[targetKey] === savePromise) {
        delete saveQueueByKeyRef.current[targetKey];
      }
      if (pendingPromptByKeyRef.current[targetKey] === content) {
        delete pendingPromptByKeyRef.current[targetKey];
      }
    }
  };

  const commitPrompt = (content: string) => {
    setCurrentPrompt(content);
    return commitPromptForKey(editorKey, content);
  };

  const flushPrompt = useEffectEvent(
    (targetKey: string, isPageExit: boolean) => {
      const currentPrompt =
        currentPromptByKeyRef.current[targetKey] ??
        initialPromptByKeyRef.current[targetKey] ??
        "";
      const lastCommittedPrompt =
        lastCommittedPromptByKeyRef.current[targetKey] ??
        initialPromptByKeyRef.current[targetKey] ??
        "";
      const hasPendingSave = saveQueueByKeyRef.current[targetKey] !== undefined;

      if (currentPrompt === lastCommittedPrompt && !hasPendingSave) {
        return;
      }

      if (isPageExit) {
        void onSaveBeforePageExitByKeyRef.current[targetKey]?.(currentPrompt);
        return;
      }

      void commitPromptForKey(targetKey, currentPrompt);
    },
  );

  useEffect(() => {
    const targetKey = editorKey;
    let isPageExiting = false;
    const handlePageHide = () => {
      isPageExiting = true;
      flushPrompt(targetKey, true);
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
        flushPrompt(targetKey, false);
      }
    };
  }, [editorKey]);

  return {
    commitPrompt,
    setCurrentPrompt,
  };
};
