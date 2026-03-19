import { Box } from "@chakra-ui/react";

import { FRAME_COUNT, LEAF_FALL_THRESHOLD, SPROUT_FRAMES } from "../constants";
import {
  getFrameIndex,
  leafFallLeftAnimation,
  leafFallRightAnimation,
} from "../utils";

type SproutAnimationProps = {
  progress: number;
};

export const SproutAnimation = ({ progress }: SproutAnimationProps) => {
  const frameIndex = getFrameIndex(progress);
  const isLeafFalling = progress >= LEAF_FALL_THRESHOLD;
  const isFullyGrown = frameIndex === FRAME_COUNT - 1;
  const fixedLeafOpacity = isFullyGrown && !isLeafFalling ? 1 : 0;

  return (
    <Box
      position="relative"
      w="110px"
      h="150px"
      flexShrink={0}
      overflow="hidden"
      color="seed"
    >
      <Box
        position="absolute"
        top={7}
        left={2}
        zIndex={1}
        opacity={0}
        animation={isLeafFalling ? leafFallLeftAnimation : undefined}
      >
        <svg width="34" height="15" viewBox="0 0 34 15" fill="none">
          <path
            d="M8.24804 5.85017C8.24804 5.85017 18.2394 -6.04899 33.188 4.09272C33.188 4.09272 25.1759 17.906 11.2409 14.0992C11.2409 14.0992 -0.514276 8.34061 0.0176865 1.04984C0.0176865 1.04984 8.26326 15.4629 20.2888 6.34433C20.2888 6.34433 12.4104 9.03976 8.22161 5.83429L8.24804 5.85017Z"
            fill="currentColor"
          />
        </svg>
      </Box>

      <Box
        position="absolute"
        top="68px"
        left="70px"
        zIndex={1}
        opacity={0}
        animation={isLeafFalling ? leafFallRightAnimation : undefined}
      >
        <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
          <path
            d="M3.19184 11.0587C3.19184 11.0587 11.2448 17.094 20.4842 11.6702C20.4842 11.6702 23.6606 9.19158 27.257 10.2098C27.257 10.2098 17.704 -4.41751 4.9067 1.34415C4.9067 1.34415 -1.502 5.72238 0.328689 9.16789C0.328689 9.16789 11.4923 3.99668 16.3208 7.55146C16.3208 7.55146 2.37954 7.47303 3.22083 11.0848L3.19184 11.0587Z"
            fill="currentColor"
          />
        </svg>
      </Box>

      <Box position="absolute" top={0} left={0} zIndex={2}>
        <svg
          viewBox="0 0 110 123"
          fill="none"
          style={{ width: "110px", height: "123px" }}
        >
          <path
            d={SPROUT_FRAMES[frameIndex]}
            fill="currentColor"
            style={{ transition: "d 0.8s linear" }}
          />
          <path
            d="M27.2837 34.2128C27.2837 34.2128 27.7856 39.8779 33.4595 41.7075C33.4595 41.7075 35.6636 42.1043 36.5801 44C36.5801 44 39.0679 34.4553 31.9319 31.259C31.9319 31.259 27.742 30.223 27 32.295C27 32.295 33.2849 35.0284 33.6123 38.401C33.6123 38.401 28.4621 32.5155 27.2837 34.2348V34.2128Z"
            fill="currentColor"
            opacity={fixedLeafOpacity}
            style={{ transition: "opacity 0.15s" }}
          />
          <path
            d="M85.8109 78.7591C85.8109 78.7591 86.7852 72.6209 93.9999 73.0185C93.9999 73.0185 94.0985 79.4052 88.5364 80.9708C88.5364 80.9708 83.3196 81.4182 82 78.8088C82 78.8088 87.7964 82.0519 90.041 76.448C90.041 76.448 87.8951 78.9952 85.7985 78.7591H85.8109Z"
            fill="currentColor"
            opacity={fixedLeafOpacity}
            style={{ transition: "opacity 0.15s" }}
          />
        </svg>
      </Box>
    </Box>
  );
};
