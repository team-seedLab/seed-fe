import { FRAME_COUNT, GROWTH_THRESHOLD } from "../constants";

export const getFrameIndex = (progress: number) => {
  const ratio = Math.min(progress, GROWTH_THRESHOLD) / GROWTH_THRESHOLD;
  return Math.min(Math.round(ratio * (FRAME_COUNT - 1)), FRAME_COUNT - 1);
};
