import type {
  KeyboardEventHandler,
  PointerEventHandler,
  ReactNode,
} from "react";

import { Button, Flex } from "@chakra-ui/react";

import { SeedAiIcon } from "@/shared";

import { AI_MENTOR_PANEL_LAYOUT } from "../../../../constants";

import { UploadAiMentorResizeHandle } from "./UploadAiMentorResizeHandle";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  isResizing: boolean;
  isSplitScreen: boolean;
  maxPanelWidth: number;
  minPanelWidth: number;
  panelWidth: number;
  onOpen: () => void;
  onResizeKeyDown: KeyboardEventHandler<HTMLDivElement>;
  onResizePointerCancel: PointerEventHandler<HTMLDivElement>;
  onResizePointerDown: PointerEventHandler<HTMLDivElement>;
  onResizePointerMove: PointerEventHandler<HTMLDivElement>;
  onResizePointerUp: PointerEventHandler<HTMLDivElement>;
};

export const UploadAiMentorResponsivePanel = ({
  children,
  isOpen,
  isResizing,
  isSplitScreen,
  maxPanelWidth,
  minPanelWidth,
  panelWidth,
  onOpen,
  onResizeKeyDown,
  onResizePointerCancel,
  onResizePointerDown,
  onResizePointerMove,
  onResizePointerUp,
}: Props) => {
  const panelGroupWidth =
    panelWidth + AI_MENTOR_PANEL_LAYOUT.RESIZE_HANDLE_WIDTH;

  return (
    <>
      {isSplitScreen ? (
        <Flex
          flexShrink={0}
          h="calc(100dvh - 100px)"
          ml={isOpen ? 9 : 0}
          maxW={
            isOpen
              ? `calc(100% - ${
                  AI_MENTOR_PANEL_LAYOUT.MIN_MAIN_WIDTH +
                  AI_MENTOR_PANEL_LAYOUT.SPACING
                }px)`
              : 0
          }
          minH={0}
          opacity={isOpen ? 1 : 0}
          overflow="hidden"
          pointerEvents={isOpen ? "auto" : "none"}
          position="sticky"
          top="80px"
          transform={isOpen ? "translateX(0)" : "translateX(40px)"}
          transition={
            isResizing
              ? "none"
              : "width 240ms ease, margin-left 240ms ease, opacity 180ms ease, transform 240ms ease"
          }
          w={isOpen ? `${panelGroupWidth}px` : 0}
        >
          {isOpen && (
            <>
              <UploadAiMentorResizeHandle
                maxWidth={maxPanelWidth}
                minWidth={minPanelWidth}
                width={panelWidth}
                onKeyDown={onResizeKeyDown}
                onPointerCancel={onResizePointerCancel}
                onPointerDown={onResizePointerDown}
                onPointerMove={onResizePointerMove}
                onPointerUp={onResizePointerUp}
              />
              <Flex flexShrink={0} h="full" w={`${panelWidth}px`}>
                {children}
              </Flex>
            </>
          )}
        </Flex>
      ) : (
        <Flex
          display={isOpen ? "flex" : "none"}
          h="calc(100dvh - 100px)"
          maxW="934px"
          minH={0}
          mx="auto"
          w="full"
        >
          {isOpen ? children : null}
        </Flex>
      )}

      {!isOpen && (
        <Button
          aria-label="AI 멘토 열기"
          bg="seed"
          borderRadius="2xl 0 0 2xl"
          color="white"
          gap={2}
          onClick={onOpen}
          position="fixed"
          right={0}
          top="50%"
          transform="translateY(-50%)"
          zIndex="overlay"
          _hover={{ opacity: 0.85 }}
        >
          <SeedAiIcon boxSize={4} />
          AI 멘토
        </Button>
      )}
    </>
  );
};
