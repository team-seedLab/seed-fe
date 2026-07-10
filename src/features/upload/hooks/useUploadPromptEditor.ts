import { useRef, useState } from "react";

type Params = {
  editorKey: string;
  originalPrompt: string;
  initialEditedPrompt?: string | null;
  onSave?: (editedPrompt: string | null) => Promise<void> | void;
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
}: Params): Result => {
  const [editedPromptByKey, setEditedPromptByKey] = useState<
    Record<string, string>
  >({});
  const lastCommittedPromptByKeyRef = useRef<Record<string, string>>({});
  const pendingPromptByKeyRef = useRef<Record<string, string>>({});
  const initialPrompt = initialEditedPrompt ?? originalPrompt;
  const editedPrompt = editedPromptByKey[editorKey] ?? initialPrompt;

  const changePrompt = (content: string) => {
    setEditedPromptByKey((previousState) => ({
      ...previousState,
      [editorKey]: content,
    }));
  };

  const commitPrompt = async (content: string) => {
    const lastCommittedPrompt =
      lastCommittedPromptByKeyRef.current[editorKey] ?? initialPrompt;

    if (
      content === lastCommittedPrompt ||
      pendingPromptByKeyRef.current[editorKey] === content
    ) {
      return false;
    }

    pendingPromptByKeyRef.current[editorKey] = content;

    try {
      await onSave?.(content === originalPrompt ? null : content);
      lastCommittedPromptByKeyRef.current[editorKey] = content;
      return true;
    } catch {
      return false;
    } finally {
      delete pendingPromptByKeyRef.current[editorKey];
    }
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
