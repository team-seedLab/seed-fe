import { useEffect, useEffectEvent, useState } from "react";

import {
  readUploadStepResultDraft,
  removeUploadStepResultDraft,
  writeUploadStepResultDraft,
} from "../utils";

import {
  type ContentPageExitSaveHandler,
  useUploadContentPageExit,
} from "./useUploadContentPageExit";
import {
  type ContentSaveHandler,
  useUploadContentSaveQueue,
} from "./useUploadContentSaveQueue";

type Params = {
  editorKey: string;
  initialResult?: string | null;
  isReady?: boolean;
  onSave?: ContentSaveHandler;
  onSaveBeforePageExit?: ContentPageExitSaveHandler;
};

export type UploadStepResultEditorState = {
  resultText: string;
  changeResult: (content: string) => void;
  commitResult: (content: string) => Promise<boolean>;
  ensureResultSaved: (content: string) => Promise<boolean>;
};

export const useUploadStepResultEditor = ({
  editorKey,
  initialResult,
  isReady = true,
  onSave,
  onSaveBeforePageExit,
}: Params): UploadStepResultEditorState => {
  const [resultByKey, setResultByKey] = useState<Record<string, string>>({});
  const [draftByKey, setDraftByKey] = useState<Record<string, string | null>>(
    () => ({
      [editorKey]: readUploadStepResultDraft(editorKey),
    }),
  );
  const initialContent = initialResult ?? "";
  const storedDraft = Object.hasOwn(draftByKey, editorKey)
    ? draftByKey[editorKey]
    : readUploadStepResultDraft(editorKey);
  const resultText = resultByKey[editorKey] ?? storedDraft ?? initialContent;

  const removeDraft = (targetKey: string) => {
    removeUploadStepResultDraft(targetKey);
    setDraftByKey((currentDrafts) => ({
      ...currentDrafts,
      [targetKey]: null,
    }));
  };
  const {
    cancelPendingSaves,
    commitContent,
    ensureContentSaved,
    flushContent,
    getUnsavedContent,
    setCurrentContent,
  } = useUploadContentSaveQueue({
    editorKey,
    initialContent,
    onSave,
  });

  const commitResult = async (content: string) => {
    const isSaved = await commitContent(content);

    if (isSaved) {
      removeDraft(editorKey);
    }

    return isSaved;
  };
  const ensureResultSaved = async (content: string) => {
    const isSaved = await ensureContentSaved(content);

    if (isSaved) {
      removeDraft(editorKey);
    }

    return isSaved;
  };
  const flushResult = (targetKey: string) => {
    const pendingSave = flushContent(targetKey);

    if (!pendingSave) {
      return;
    }

    void pendingSave.then((isSaved) => {
      if (isSaved) {
        removeDraft(targetKey);
      }
    });
  };

  const saveBeforePageExit = (content: string) => {
    writeUploadStepResultDraft(editorKey, content);
    return onSaveBeforePageExit?.(content);
  };

  useUploadContentPageExit({
    editorKey,
    cancelPendingSaves,
    flushContent: flushResult,
    getUnsavedContent,
    onSaveBeforePageExit: saveBeforePageExit,
  });

  const restoreDraft = useEffectEvent(
    (targetKey: string, draft: string, savedContent: string) => {
      if (draft === savedContent) {
        removeDraft(targetKey);
        return;
      }

      setCurrentContent(draft);
      setResultByKey((previousState) => ({
        ...previousState,
        [targetKey]: draft,
      }));
      void commitResult(draft);
    },
  );
  const persistUnsavedDraft = useEffectEvent((targetKey: string) => {
    const unsavedContent = getUnsavedContent(targetKey);

    if (unsavedContent !== null) {
      writeUploadStepResultDraft(targetKey, unsavedContent);
    }
  });

  useEffect(() => {
    if (!isReady || storedDraft === null) {
      return;
    }

    restoreDraft(editorKey, storedDraft, initialContent);
  }, [editorKey, initialContent, isReady, storedDraft]);

  useEffect(() => {
    const targetKey = editorKey;

    return () => {
      persistUnsavedDraft(targetKey);
    };
  }, [editorKey]);

  const changeResult = (content: string) => {
    setCurrentContent(content);
    setResultByKey((previousState) => ({
      ...previousState,
      [editorKey]: content,
    }));
  };

  return {
    resultText,
    changeResult,
    commitResult,
    ensureResultSaved,
  };
};
