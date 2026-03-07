import { SolutionProgressPanel } from "../solutionSection/common/solutionProgressPanel";

type ExecutionOnlySectionProps = {
  isActivated: boolean;
};

export const ExecutionOnlySection = ({
  isActivated,
}: ExecutionOnlySectionProps) => {
  return <SolutionProgressPanel isActivated={isActivated} />;
};
