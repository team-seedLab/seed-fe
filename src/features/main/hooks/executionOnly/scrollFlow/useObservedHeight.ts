import { useEffect, useRef, useState } from "react";

// 요소 높이를 읽고, 크기가 바뀌면 다시 알려줌
const observeHeight = ({
  node,
  onMeasure,
}: {
  node: HTMLElement | null;
  onMeasure: (height: number) => void;
}) => {
  if (!node) {
    onMeasure(0);
    return () => undefined;
  }

  // 현재 요소 높이를 다시 읽어서 넘김
  const updateHeight = () => {
    onMeasure(node.scrollHeight);
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
};

type UseObservedHeightParams = {
  fallbackHeight: number;
  watchKey: string;
};

// 요소 높이를 재고, 못 쟀으면 기본 높이값을 씀
export const useObservedHeight = <T extends HTMLElement>({
  fallbackHeight,
  watchKey,
}: UseObservedHeightParams) => {
  const contentRef = useRef<T | null>(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  useEffect(() => {
    return observeHeight({
      node: contentRef.current,
      onMeasure: setMeasuredHeight,
    });
  }, [watchKey]);

  return {
    contentRef,
    resolvedHeight: measuredHeight > 0 ? measuredHeight : fallbackHeight,
  };
};
