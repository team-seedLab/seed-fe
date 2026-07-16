import { useEffect, useRef, useState } from "react";

export const useProjectStepResultInputViewHeight = () => {
  const inputViewRef = useRef<HTMLDivElement>(null);
  const [inputViewHeight, setInputViewHeight] = useState<number | null>(null);

  useEffect(() => {
    const inputView = inputViewRef.current;

    if (!inputView) {
      return;
    }

    const updateInputViewHeight = () => {
      const nextHeight = inputView.getBoundingClientRect().height;

      if (nextHeight <= 0) {
        return;
      }

      setInputViewHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      );
    };

    updateInputViewHeight();

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateInputViewHeight);
    observer?.observe(inputView);
    window.addEventListener("resize", updateInputViewHeight, {
      passive: true,
    });

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateInputViewHeight);
    };
  }, []);

  return { inputViewHeight, inputViewRef };
};
