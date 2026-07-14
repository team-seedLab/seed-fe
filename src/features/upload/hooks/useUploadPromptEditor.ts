import { useState } from "react";

import {
  type PromptPageExitSaveHandler,
  useUploadPromptPageExit,
} from "./useUploadPromptPageExit";
import {
  type PromptSaveHandler,
  useUploadPromptSaveQueue,
} from "./useUploadPromptSaveQueue";

type Params = {
  editorKey: string;
  originalPrompt: string;
  initialEditedPrompt?: string | null;
  onSave?: PromptSaveHandler;
  onSaveBeforePageExit?: PromptPageExitSaveHandler;
};

type Result = {
  editedPrompt: string;
  changePrompt: (content: string) => void;
  commitPrompt: (content: string) => Promise<boolean>;
  resetPrompt: () => Promise<boolean>;
};

export const useUploadPromptEditor = ({
  editorKey,
  originalPrompt,
  initialEditedPrompt,
  onSave,
  onSaveBeforePageExit,
}: Params): Result => {
  const [editedPromptByKey, setEditedPromptByKey] = useState<
    Record<string, string>
  >({});
  const initialPrompt = initialEditedPrompt ?? originalPrompt;
  const editedPrompt = editedPromptByKey[editorKey] ?? initialPrompt;
  const {
    cancelPendingSaves,
    commitPrompt,
    flushPrompt,
    getUnsavedPrompt,
    setCurrentPrompt,
  } = useUploadPromptSaveQueue({ editorKey, initialPrompt, onSave });

  useUploadPromptPageExit({
    editorKey,
    cancelPendingSaves,
    flushPrompt,
    getUnsavedPrompt,
    onSaveBeforePageExit,
  });

  const changePrompt = (content: string) => {
    setCurrentPrompt(content);
    setEditedPromptByKey((previousState) => ({
      ...previousState,
      [editorKey]: content,
    }));
  };

  const resetPrompt = async () => {
    changePrompt(originalPrompt);
    return commitPrompt(originalPrompt);
  };

  return {
    editedPrompt,
    changePrompt,
    commitPrompt,
    resetPrompt,
  };
};
