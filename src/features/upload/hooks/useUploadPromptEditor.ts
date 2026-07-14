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

export type UploadPromptEditorState = {
  editedPrompt: string;
  changePrompt: (content: string) => void;
  commitPrompt: (content: string) => Promise<boolean>;
  ensurePromptSaved: (content: string) => Promise<boolean>;
  resetPrompt: () => Promise<boolean>;
};

export const useUploadPromptEditor = ({
  editorKey,
  originalPrompt,
  initialEditedPrompt,
  onSave,
  onSaveBeforePageExit,
}: Params): UploadPromptEditorState => {
  const [editedPromptByKey, setEditedPromptByKey] = useState<
    Record<string, string>
  >({});
  const initialPrompt = initialEditedPrompt ?? originalPrompt;
  const editedPrompt = editedPromptByKey[editorKey] ?? initialPrompt;
  const {
    cancelPendingSaves,
    commitPrompt,
    ensurePromptSaved,
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
    ensurePromptSaved,
    resetPrompt,
  };
};
