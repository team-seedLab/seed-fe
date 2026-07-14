import {
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { AI_MENTOR_PANEL_LAYOUT } from "../constants";

type Params = {
  containerRef: RefObject<HTMLElement | null>;
  enabled: boolean;
};

type DragStart = {
  panelWidth: number;
  pointerX: number;
};

const clampPanelWidth = (width: number, maxWidth: number) =>
  Math.min(Math.max(width, AI_MENTOR_PANEL_LAYOUT.MIN_WIDTH), maxWidth);

export const useUploadAiMentorResize = ({ containerRef, enabled }: Params) => {
  const [preferredWidth, setPreferredWidth] = useState<number>(
    AI_MENTOR_PANEL_LAYOUT.DEFAULT_WIDTH,
  );
  const [maxPanelWidth, setMaxPanelWidth] = useState<number>(
    AI_MENTOR_PANEL_LAYOUT.MAX_WIDTH,
  );
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<DragStart | null>(null);
  const panelWidth = clampPanelWidth(preferredWidth, maxPanelWidth);

  useEffect(() => {
    const container = containerRef.current;

    if (!enabled || !container || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateMaxPanelWidth = () => {
      const availableWidth =
        container.getBoundingClientRect().width -
        AI_MENTOR_PANEL_LAYOUT.MIN_MAIN_WIDTH -
        AI_MENTOR_PANEL_LAYOUT.SPACING -
        AI_MENTOR_PANEL_LAYOUT.RESIZE_HANDLE_WIDTH;

      setMaxPanelWidth(
        clampPanelWidth(availableWidth, AI_MENTOR_PANEL_LAYOUT.MAX_WIDTH),
      );
    };

    updateMaxPanelWidth();

    const observer = new ResizeObserver(updateMaxPanelWidth);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, enabled]);

  const handleResizePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      panelWidth,
      pointerX: event.clientX,
    };
    setIsResizing(true);
  };

  const handleResizePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragStart = dragStartRef.current;

    if (!dragStart) {
      return;
    }

    const nextWidth = dragStart.panelWidth + dragStart.pointerX - event.clientX;
    setPreferredWidth(clampPanelWidth(nextWidth, maxPanelWidth));
  };

  const finishResize = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStartRef.current = null;
    setIsResizing(false);
  };

  const handleResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const resizeBy = (offset: number) => {
      setPreferredWidth((currentWidth) =>
        clampPanelWidth(currentWidth + offset, maxPanelWidth),
      );
    };

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        resizeBy(AI_MENTOR_PANEL_LAYOUT.KEYBOARD_RESIZE_STEP);
        break;
      case "ArrowRight":
        event.preventDefault();
        resizeBy(-AI_MENTOR_PANEL_LAYOUT.KEYBOARD_RESIZE_STEP);
        break;
      case "Home":
        event.preventDefault();
        setPreferredWidth(maxPanelWidth);
        break;
      case "End":
        event.preventDefault();
        setPreferredWidth(AI_MENTOR_PANEL_LAYOUT.MIN_WIDTH);
        break;
    }
  };

  return {
    handleResizeKeyDown,
    handleResizePointerCancel: finishResize,
    handleResizePointerDown,
    handleResizePointerMove,
    handleResizePointerUp: finishResize,
    isResizing,
    maxPanelWidth,
    minPanelWidth: AI_MENTOR_PANEL_LAYOUT.MIN_WIDTH,
    panelWidth,
  };
};
