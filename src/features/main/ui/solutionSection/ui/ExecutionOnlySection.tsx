import { SolutionProgressPanel } from "../common/solutionProgressPanel";

type ExecutionOnlySectionProps = {
  isActivated: boolean;
};

// Public section entry for the solution walkthrough block.
// solution walkthrough 블록의 외부 엔트리 섹션
export const ExecutionOnlySection = ({
  isActivated,
}: ExecutionOnlySectionProps) => {
  return <SolutionProgressPanel isActivated={isActivated} />;
};
