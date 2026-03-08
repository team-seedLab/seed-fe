// 값을 최소값과 최대값 사이로 맞춤
export const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

// 값을 0과 1 사이로 맞춤
export const clamp01 = (value: number) => {
  return clamp(value, 0, 1);
};
