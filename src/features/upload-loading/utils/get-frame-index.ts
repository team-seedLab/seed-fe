import { FRAME_COUNT, GROWTH_THRESHOLD } from "../constants";

// progress를 받아서 몇 프레임인지 반환해주는 함수
export const getFrameIndex = (progress: number) => {
  const ratio = Math.min(progress, GROWTH_THRESHOLD) / GROWTH_THRESHOLD;
  return Math.min(Math.round(ratio * (FRAME_COUNT - 1)), FRAME_COUNT - 1);
};
