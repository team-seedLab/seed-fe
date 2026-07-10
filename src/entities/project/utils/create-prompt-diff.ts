import { diffLines } from "diff";

export type PromptDiffLineType = "unchanged" | "added" | "removed";

export type PromptDiffLine = {
  content: string;
  type: PromptDiffLineType;
};

export type PromptDiffResult = {
  addedCount: number;
  hasChanges: boolean;
  lines: PromptDiffLine[];
  removedCount: number;
};

const normalizePrompt = (content: string) => {
  return content.replace(/\r\n?/g, "\n").replace(/\n$/, "");
};

const splitChangedValue = (value: string) => {
  const lines = value.split("\n");

  if (lines.at(-1) === "") {
    lines.pop();
  }

  return lines;
};

export const createPromptDiff = (
  originalContent: string,
  editedContent: string,
): PromptDiffResult => {
  const changes = diffLines(
    normalizePrompt(originalContent),
    normalizePrompt(editedContent),
    {
      ignoreNewlineAtEof: true,
      stripTrailingCr: true,
    },
  );
  const lines = changes.flatMap<PromptDiffLine>((change) => {
    const type: PromptDiffLineType = change.added
      ? "added"
      : change.removed
        ? "removed"
        : "unchanged";

    return splitChangedValue(change.value).map((content) => ({
      content,
      type,
    }));
  });
  const addedCount = lines.filter((line) => line.type === "added").length;
  const removedCount = lines.filter((line) => line.type === "removed").length;

  return {
    addedCount,
    hasChanges: addedCount > 0 || removedCount > 0,
    lines,
    removedCount,
  };
};
