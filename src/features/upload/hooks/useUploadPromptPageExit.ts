import {
  type ContentPageExitSaveHandler,
  useUploadContentPageExit,
} from "./useUploadContentPageExit";

export type PromptPageExitSaveHandler = ContentPageExitSaveHandler;

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
  useUploadContentPageExit({
    editorKey,
    cancelPendingSaves,
    flushContent: flushPrompt,
    getUnsavedContent: getUnsavedPrompt,
    onSaveBeforePageExit,
  });
};
