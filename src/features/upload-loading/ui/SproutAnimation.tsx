import { Box } from "@chakra-ui/react";

import { FRAME_COUNT, SPROUT_FRAMES } from "../constants";

type SproutAnimationProps = {
  progress: number;
};

const getFrameIndex = (progress: number) => {
  const clamped = Math.max(0, Math.min(100, progress));
  return Math.min(
    Math.round((clamped / 100) * (FRAME_COUNT - 1)),
    FRAME_COUNT - 1,
  );
};

export const SproutAnimation = ({ progress }: SproutAnimationProps) => {
  const frameIndex = getFrameIndex(progress);

  console.log("progress:", progress, "frameIndex:", frameIndex);

  return (
    <Box w="110px" h="123px" flexShrink={0}>
      <svg
        viewBox="0 0 110 123"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <path
          d={SPROUT_FRAMES[frameIndex]}
          fill="#98C95C"
          style={{ transition: "d 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)" }}
        />
      </svg>
    </Box>
  );
};
