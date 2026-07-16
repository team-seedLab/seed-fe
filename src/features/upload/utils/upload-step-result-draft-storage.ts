const STORAGE_KEY_PREFIX = "seed:upload-step-result-draft:";

const getStorageKey = (editorKey: string) =>
  `${STORAGE_KEY_PREFIX}${editorKey}`;

export const readUploadStepResultDraft = (editorKey: string) => {
  try {
    return window.localStorage.getItem(getStorageKey(editorKey));
  } catch {
    return null;
  }
};

export const writeUploadStepResultDraft = (
  editorKey: string,
  content: string,
) => {
  try {
    window.localStorage.setItem(getStorageKey(editorKey), content);
  } catch {
    return;
  }
};

export const removeUploadStepResultDraft = (editorKey: string) => {
  try {
    window.localStorage.removeItem(getStorageKey(editorKey));
  } catch {
    return;
  }
};
