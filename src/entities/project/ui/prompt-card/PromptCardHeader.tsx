import { PromptCardComparisonHeader } from "./PromptCardComparisonHeader";
import { PromptCardReadOnlyHeader } from "./PromptCardReadOnlyHeader";

type Props = {
  addedCount?: number;
  copied: boolean;
  hasChanges?: boolean;
  isDiffVisible?: boolean;
  label: string;
  removedCount?: number;
  showComparisonControls: boolean;
  showReset: boolean;
  onCopy: () => void;
  onReset?: () => void;
  onToggleDiff?: () => void;
};

export const PromptCardHeader = ({
  addedCount = 0,
  copied,
  hasChanges = false,
  isDiffVisible = false,
  label,
  removedCount = 0,
  showComparisonControls,
  showReset,
  onCopy,
  onReset,
  onToggleDiff,
}: Props) => {
  if (!showComparisonControls) {
    return (
      <PromptCardReadOnlyHeader copied={copied} label={label} onCopy={onCopy} />
    );
  }

  return (
    <PromptCardComparisonHeader
      addedCount={addedCount}
      copied={copied}
      hasChanges={hasChanges}
      isDiffVisible={isDiffVisible}
      label={label}
      removedCount={removedCount}
      showReset={showReset}
      onCopy={onCopy}
      onReset={onReset}
      onToggleDiff={onToggleDiff}
    />
  );
};
