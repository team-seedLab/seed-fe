import { useEffect, useRef } from "react";

export type ContentSaveHandler = (
  content: string,
  signal?: AbortSignal,
) => Promise<void> | void;

type Params = {
  editorKey: string;
  initialContent: string;
  onSave?: ContentSaveHandler;
};

export const useUploadContentSaveQueue = ({
  editorKey,
  initialContent,
  onSave,
}: Params) => {
  const currentContentByKeyRef = useRef<Record<string, string>>({});
  const initialContentByKeyRef = useRef<Record<string, string>>({});
  const lastCommittedContentByKeyRef = useRef<Record<string, string>>({});
  const pendingContentByKeyRef = useRef<Record<string, string>>({});
  const saveQueueByKeyRef = useRef<Record<string, Promise<void>>>({});
  const saveGenerationByKeyRef = useRef<Record<string, number>>({});
  const activeSaveControllerByKeyRef = useRef<
    Record<string, AbortController | undefined>
  >({});
  const onSaveByKeyRef = useRef<Record<string, ContentSaveHandler | undefined>>(
    {},
  );

  useEffect(() => {
    initialContentByKeyRef.current[editorKey] = initialContent;
    onSaveByKeyRef.current[editorKey] = onSave;
  }, [editorKey, initialContent, onSave]);

  const setCurrentContent = (content: string) => {
    currentContentByKeyRef.current[editorKey] = content;
  };

  const commitContentForKey = async (targetKey: string, content: string) => {
    const saveHandler = onSaveByKeyRef.current[targetKey];

    if (!saveHandler) {
      return false;
    }

    const initialContentForKey =
      initialContentByKeyRef.current[targetKey] ?? "";
    const lastCommittedContent =
      lastCommittedContentByKeyRef.current[targetKey] ?? initialContentForKey;
    const hasPendingSave = saveQueueByKeyRef.current[targetKey] !== undefined;

    if (
      (!hasPendingSave && content === lastCommittedContent) ||
      pendingContentByKeyRef.current[targetKey] === content
    ) {
      return false;
    }

    const saveGeneration = saveGenerationByKeyRef.current[targetKey] ?? 0;
    pendingContentByKeyRef.current[targetKey] = content;
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
          await saveHandler(content, controller.signal);
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

      lastCommittedContentByKeyRef.current[targetKey] = content;
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
        pendingContentByKeyRef.current[targetKey] === content
      ) {
        delete pendingContentByKeyRef.current[targetKey];
      }
    }
  };

  const commitContent = (content: string) => {
    setCurrentContent(content);
    return commitContentForKey(editorKey, content);
  };

  const ensureContentSaved = async (content: string) => {
    setCurrentContent(content);

    if (pendingContentByKeyRef.current[editorKey] === content) {
      try {
        await saveQueueByKeyRef.current[editorKey];
      } catch {
        return false;
      }

      return lastCommittedContentByKeyRef.current[editorKey] === content;
    }

    const lastCommittedContent =
      lastCommittedContentByKeyRef.current[editorKey] ??
      initialContentByKeyRef.current[editorKey] ??
      "";
    const hasPendingSave = saveQueueByKeyRef.current[editorKey] !== undefined;

    if (lastCommittedContent === content && !hasPendingSave) {
      return true;
    }

    return commitContentForKey(editorKey, content);
  };

  const getUnsavedContent = (targetKey: string) => {
    const currentContent =
      currentContentByKeyRef.current[targetKey] ??
      initialContentByKeyRef.current[targetKey] ??
      "";
    const lastCommittedContent =
      lastCommittedContentByKeyRef.current[targetKey] ??
      initialContentByKeyRef.current[targetKey] ??
      "";
    const hasPendingSave = saveQueueByKeyRef.current[targetKey] !== undefined;

    if (currentContent === lastCommittedContent && !hasPendingSave) {
      return null;
    }

    return currentContent;
  };

  const flushContent = (targetKey: string) => {
    const unsavedContent = getUnsavedContent(targetKey);

    if (unsavedContent === null) {
      return null;
    }

    return commitContentForKey(targetKey, unsavedContent);
  };

  const cancelPendingSaves = (targetKey: string) => {
    saveGenerationByKeyRef.current[targetKey] =
      (saveGenerationByKeyRef.current[targetKey] ?? 0) + 1;
    activeSaveControllerByKeyRef.current[targetKey]?.abort();

    delete activeSaveControllerByKeyRef.current[targetKey];
    delete pendingContentByKeyRef.current[targetKey];
    delete saveQueueByKeyRef.current[targetKey];
  };

  return {
    cancelPendingSaves,
    commitContent,
    ensureContentSaved,
    flushContent,
    getUnsavedContent,
    setCurrentContent,
  };
};
