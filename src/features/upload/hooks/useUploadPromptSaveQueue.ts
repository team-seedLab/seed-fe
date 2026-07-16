import {
  type ContentSaveHandler,
  useUploadContentSaveQueue,
} from "./useUploadContentSaveQueue";

export type PromptSaveHandler = ContentSaveHandler;

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
  const {
    cancelPendingSaves,
    commitContent,
    ensureContentSaved,
    flushContent,
    getUnsavedContent,
    setCurrentContent,
  } = useUploadContentSaveQueue({
    editorKey,
    initialContent: initialPrompt,
    onSave,
  });

  return {
    cancelPendingSaves,
    commitPrompt: commitContent,
    ensurePromptSaved: ensureContentSaved,
    flushPrompt: flushContent,
    getUnsavedPrompt: getUnsavedContent,
    setCurrentPrompt: setCurrentContent,
  };
};
