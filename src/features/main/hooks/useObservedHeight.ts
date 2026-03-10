import { useEffect, useRef, useState } from "react";

type UseObservedHeightParams = {
  fallbackHeight: number;
  watchKey: string;
};

export const useObservedHeight = <T extends HTMLElement>({
  fallbackHeight,
  watchKey,
}: UseObservedHeightParams) => {
  const contentRef = useRef<T | null>(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  useEffect(() => {
    const node = contentRef.current;

    if (!node) {
      return;
    }

    const updateHeight = () => {
      setMeasuredHeight(node.scrollHeight);
    };

    updateHeight();

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            updateHeight();
          });

    observer?.observe(node);
    window.addEventListener("resize", updateHeight, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [watchKey]);

  return {
    contentRef,
    resolvedHeight: measuredHeight > 0 ? measuredHeight : fallbackHeight,
  };
};
