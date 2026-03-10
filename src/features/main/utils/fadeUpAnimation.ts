import { keyframes } from "@emotion/react";

type CreateFadeUpAnimationParams = {
  distancePx: number;
  durationMs: number;
};

const DEFAULT_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

// 아래에서 위로 올라오며 나타나는 애니메이션 문자열을 만듦
export const createFadeUpAnimation = ({
  distancePx,
  durationMs,
}: CreateFadeUpAnimationParams) => {
  return `${keyframes`
    from {
      opacity: 0;
      transform: translateY(${distancePx}px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  `} ${durationMs}ms ${DEFAULT_EASING} both`;
};
