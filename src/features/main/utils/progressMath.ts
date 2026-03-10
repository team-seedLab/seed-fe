import { clamp01 } from "./clamp";

export type ProgressRange = readonly [number, number];

type ScrollTravelProgressParams = {
  height: number;
  top: number;
  viewportHeight: number;
};

export const lerp = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress;
};

export const clampedLerp = (start: number, end: number, progress: number) => {
  return lerp(start, end, clamp01(progress));
};

export const windowedProgress = (value: number, start: number, end: number) => {
  if (start === end) {
    return value >= end ? 1 : 0;
  }

  return clamp01((value - start) / (end - start));
};

export const rangeProgress = (value: number, [start, end]: ProgressRange) => {
  if (start === end) {
    return 0;
  }

  return clamp01((value - start) / (end - start));
};

export const scrollTravelProgress = ({
  height,
  top,
  viewportHeight,
}: ScrollTravelProgressParams) => {
  const travel = height - viewportHeight;

  if (travel <= 1) {
    return top <= 0 ? 1 : 0;
  }

  return clamp01(-top / travel);
};
