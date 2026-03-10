import { scrollTravelProgress } from "./progressMath";

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
  return scrollTravelProgress({
    height,
    top,
    viewportHeight,
  });
};
