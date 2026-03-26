import { useCallback, useEffect, useRef, useState } from "react";

import { toaster } from "../utils";

type UseClipboardCopyOptions = {
  successDuration?: number;
  unsupportedMessage?: string;
  errorMessage?: string;
};

export const useClipboardCopy = ({
  successDuration = 2000,
  unsupportedMessage,
  errorMessage,
}: UseClipboardCopyOptions = {}) => {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearResetTimer, [clearResetTimer]);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard?.writeText) {
        toaster.create({
          type: "error",
          description:
            unsupportedMessage ??
            "클립보드 복사에 실패했습니다. 브라우저가 클립보드를 지원하지 않습니다.",
        });
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        clearResetTimer();
        resetTimerRef.current = window.setTimeout(() => {
          setCopied(false);
          resetTimerRef.current = null;
        }, successDuration);
        return true;
      } catch (error) {
        console.error("Failed to copy to clipboard", error);
        toaster.create({
          type: "error",
          description:
            errorMessage ??
            "클립보드 복사에 실패했습니다. 브라우저 권한 또는 HTTPS 환경을 확인해주세요.",
        });
        return false;
      }
    },
    [clearResetTimer, errorMessage, successDuration, unsupportedMessage],
  );

  return { copied, copy };
};
