import type { KeyboardEventHandler, PointerEventHandler } from "react";

import { Box } from "@chakra-ui/react";

type Props = {
  maxWidth: number;
  minWidth: number;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  onPointerCancel: PointerEventHandler<HTMLDivElement>;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerUp: PointerEventHandler<HTMLDivElement>;
  width: number;
};

export const UploadAiMentorResizeHandle = ({
  maxWidth,
  minWidth,
  onKeyDown,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  width,
}: Props) => {
  return (
    <Box
      aria-label="AI 멘토 영역 크기 조절"
      aria-orientation="vertical"
      aria-valuemax={maxWidth}
      aria-valuemin={minWidth}
      aria-valuenow={width}
      cursor="col-resize"
      flexShrink={0}
      h="full"
      onKeyDown={onKeyDown}
      onPointerCancel={onPointerCancel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      position="relative"
      role="separator"
      tabIndex={0}
      touchAction="none"
      w={3}
      _focusVisible={{ outline: "2px solid", outlineColor: "seed" }}
    >
      <Box
        bg="neutral.100"
        h="full"
        left="50%"
        position="absolute"
        top={0}
        transform="translateX(-50%)"
        w="1px"
      />
    </Box>
  );
};
