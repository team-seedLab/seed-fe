import { useMemo, useState } from "react";

import { type PromptDiffResult, createPromptDiff } from "../../../utils";

type Params = {
  content: string;
  originalContent: string;
};

type Result = {
  closeDiff: () => void;
  diff: PromptDiffResult;
  isDiffVisible: boolean;
  toggleDiff: () => void;
};

export const usePromptCardDiff = ({
  content,
  originalContent,
}: Params): Result => {
  const [diffViewState, setDiffViewState] = useState({
    isVisible: false,
    originalContent,
  });
  const isDiffVisible =
    diffViewState.originalContent === originalContent &&
    diffViewState.isVisible;
  const diff = useMemo(() => {
    return createPromptDiff(originalContent, content);
  }, [content, originalContent]);

  const toggleDiff = () => {
    setDiffViewState((previousState) => ({
      isVisible:
        previousState.originalContent === originalContent
          ? !previousState.isVisible
          : true,
      originalContent,
    }));
  };

  const closeDiff = () => {
    setDiffViewState({
      isVisible: false,
      originalContent,
    });
  };

  return {
    closeDiff,
    diff,
    isDiffVisible,
    toggleDiff,
  };
};
