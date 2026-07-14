import { useEffect, useRef } from "react";

export type PromptSaveHandler = (
  editedPrompt: string,
  signal?: AbortSignal,
) => Promise<void> | void;

type Params = {
  editorKey: string;
  initialPrompt: string;
  onSave?: PromptSaveHandler;
};

export const useUploadPromptSaveQueue = ({
  editorKey,
  initialPrompt,
  onSave,
}: Params) => {
  const currentPromptByKeyRef = useRef<Record<string, string>>({});
  const initialPromptByKeyRef = useRef<Record<string, string>>({});
  const lastCommittedPromptByKeyRef = useRef<Record<string, string>>({});
  const pendingPromptByKeyRef = useRef<Record<string, string>>({});
  const saveQueueByKeyRef = useRef<Record<string, Promise<void>>>({});
  const saveGenerationByKeyRef = useRef<Record<string, number>>({});
  const activeSaveControllerByKeyRef = useRef<
    Record<string, AbortController | undefined>
  >({});
  const onSaveByKeyRef = useRef<Record<string, PromptSaveHandler | undefined>>(
    {},
  );

  useEffect(() => {
    initialPromptByKeyRef.current[editorKey] = initialPrompt;
    onSaveByKeyRef.current[editorKey] = onSave;
  }, [editorKey, initialPrompt, onSave]);

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

    const saveGeneration = saveGenerationByKeyRef.current[targetKey] ?? 0;
    pendingPromptByKeyRef.current[targetKey] = content;
    const previousSave =
      saveQueueByKeyRef.current[targetKey] ?? Promise.resolve();
    const savePromise = previousSave
      .catch(() => undefined)
      .then(async () => {
        if (
          (saveGenerationByKeyRef.current[targetKey] ?? 0) !== saveGeneration
        ) {
          return;
        }

        const controller = new AbortController();
        activeSaveControllerByKeyRef.current[targetKey] = controller;

        try {
          await onSaveByKeyRef.current[targetKey]?.(content, controller.signal);
        } finally {
          if (activeSaveControllerByKeyRef.current[targetKey] === controller) {
            delete activeSaveControllerByKeyRef.current[targetKey];
          }
        }
      });
    saveQueueByKeyRef.current[targetKey] = savePromise;

    try {
      await savePromise;

      if ((saveGenerationByKeyRef.current[targetKey] ?? 0) !== saveGeneration) {
        return false;
      }

      lastCommittedPromptByKeyRef.current[targetKey] = content;
      return true;
    } catch {
      return false;
    } finally {
      const isLatestSave = saveQueueByKeyRef.current[targetKey] === savePromise;

      if (isLatestSave) {
        delete saveQueueByKeyRef.current[targetKey];
      }
      if (
        isLatestSave &&
        (saveGenerationByKeyRef.current[targetKey] ?? 0) === saveGeneration &&
        pendingPromptByKeyRef.current[targetKey] === content
      ) {
        delete pendingPromptByKeyRef.current[targetKey];
      }
    }
  };

  const commitPrompt = (content: string) => {
    setCurrentPrompt(content);
    return commitPromptForKey(editorKey, content);
  };

  const ensurePromptSaved = async (content: string) => {
    setCurrentPrompt(content);

    if (pendingPromptByKeyRef.current[editorKey] === content) {
      try {
        await saveQueueByKeyRef.current[editorKey];
      } catch {
        return false;
      }

      return lastCommittedPromptByKeyRef.current[editorKey] === content;
    }

    const lastCommittedPrompt =
      lastCommittedPromptByKeyRef.current[editorKey] ??
      initialPromptByKeyRef.current[editorKey] ??
      "";

    if (lastCommittedPrompt === content) {
      return true;
    }

    return commitPromptForKey(editorKey, content);
  };

  const getUnsavedPrompt = (targetKey: string) => {
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
      return null;
    }

    return currentPrompt;
  };

  const flushPrompt = (targetKey: string) => {
    const unsavedPrompt = getUnsavedPrompt(targetKey);

    if (unsavedPrompt === null) {
      return;
    }

    void commitPromptForKey(targetKey, unsavedPrompt);
  };

  const cancelPendingSaves = (targetKey: string) => {
    saveGenerationByKeyRef.current[targetKey] =
      (saveGenerationByKeyRef.current[targetKey] ?? 0) + 1;
    activeSaveControllerByKeyRef.current[targetKey]?.abort();

    delete activeSaveControllerByKeyRef.current[targetKey];
    delete pendingPromptByKeyRef.current[targetKey];
    delete saveQueueByKeyRef.current[targetKey];
  };

  return {
    cancelPendingSaves,
    commitPrompt,
    ensurePromptSaved,
    flushPrompt,
    getUnsavedPrompt,
    setCurrentPrompt,
  };
};
