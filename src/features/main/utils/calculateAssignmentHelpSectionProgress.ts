import { clamp01 } from "./clamp";

type CalculateAssignmentHelpSectionProgressParams = {
  height: number;
  top: number;
  viewportHeight: number;
};

export const calculateAssignmentHelpSectionProgress = ({
  height,
  top,
  viewportHeight,
}: CalculateAssignmentHelpSectionProgressParams) => {
  const travel = height - viewportHeight;

  if (travel <= 1) {
    return top <= 0 ? 1 : 0;
  }

  return clamp01(-top / travel);
};
