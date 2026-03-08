import type { ReactNode } from "react";

import { Box } from "@chakra-ui/react";

type AnalysisPanelRevealProps = {
  children: ReactNode;
  progress: number;
  revealHeight: number;
};

const revealMaxHeight = (progress: number, maxHeightPx: number) => {
  return `${(progress * maxHeightPx).toFixed(2)}px`;
};

// Shared reveal wrapper for staged analysis sub-blocks inside the analysis stage.
// analysis stage 내부 세부 블록에 공통으로 쓰는 reveal wrapper
export const AnalysisPanelReveal = ({
  children,
  progress,
  revealHeight,
}: AnalysisPanelRevealProps) => {
  return (
    <Box
      maxH={revealMaxHeight(progress, revealHeight)}
      opacity={progress}
      overflow="hidden"
      transform={`translateY(${((1 - progress) * 16).toFixed(2)}px)`}
      transition="max-height 220ms ease, opacity 220ms ease, transform 220ms ease"
      w="full"
    >
      {children}
    </Box>
  );
};
