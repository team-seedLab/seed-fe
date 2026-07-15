import type { FocusEvent } from "react";

import { Box } from "@chakra-ui/react";

import {
  PromptCardContent,
  type PromptCardContentVariant,
} from "./PromptCardContent";
import { PromptCardEditor } from "./PromptCardEditor";
import { PromptCardHeader } from "./PromptCardHeader";
import { PromptDiffContent } from "./PromptDiffContent";
import { usePromptCardDiff, usePromptCardEditorFocus } from "./hooks";

type BaseProps = {
  label: string;
  content: string;
  onCopy: () => void;
  copied?: boolean;
};

type ReadOnlyProps = BaseProps & {
  mode?: "readonly";
  contentVariant?: PromptCardContentVariant;
};

type EditableProps = BaseProps & {
  mode: "editable";
  contentVariant?: never;
  editorFocusRequestId?: number | null;
  originalContent: string;
  onCommit: (content: string) => void;
  onContentChange: (content: string) => void;
  onReset: () => void;
};

type ComparisonProps = BaseProps & {
  mode: "comparison";
  contentVariant?: PromptCardContentVariant;
  originalContent: string;
};

type Props = ReadOnlyProps | EditableProps | ComparisonProps;

export const PromptCard = (props: Props) => {
  const {
    label,
    content,
    contentVariant = "default",
    onCopy,
    copied = false,
  } = props;
  const mode = props.mode ?? "readonly";
  const originalContent =
    props.mode === "editable" || props.mode === "comparison"
      ? props.originalContent
      : content;
  const { closeDiff, diff, isDiffVisible, toggleDiff } = usePromptCardDiff({
    content,
    originalContent,
  });
  const editorRef = usePromptCardEditorFocus({
    closeDiff,
    focusRequestId:
      props.mode === "editable" ? (props.editorFocusRequestId ?? null) : null,
    isDiffVisible,
  });

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (props.mode !== "editable") {
      return;
    }

    const nextFocusedElement = event.relatedTarget;
    if (
      nextFocusedElement instanceof Node &&
      event.currentTarget.contains(nextFocusedElement)
    ) {
      return;
    }

    props.onCommit(content);
  };

  const handleReset = () => {
    if (props.mode !== "editable") {
      return;
    }

    closeDiff();
    props.onReset();
  };

  return (
    <Box
      bg="neutral.50"
      border="1px solid"
      borderColor="neutral.50"
      borderRadius={{ base: "xl", md: "2xl" }}
      overflow="hidden"
      w="full"
      onBlur={handleBlur}
    >
      <PromptCardHeader
        addedCount={diff.addedCount}
        copied={copied}
        hasChanges={diff.hasChanges}
        isDiffVisible={isDiffVisible}
        label={label}
        removedCount={diff.removedCount}
        showComparisonControls={mode !== "readonly"}
        showReset={mode === "editable"}
        onCopy={onCopy}
        onReset={props.mode === "editable" ? handleReset : undefined}
        onToggleDiff={toggleDiff}
      />

      {isDiffVisible && mode !== "readonly" ? (
        <PromptDiffContent lines={diff.lines} variant={contentVariant} />
      ) : props.mode === "editable" ? (
        <PromptCardEditor
          content={content}
          editorRef={editorRef}
          label={label}
          onContentChange={props.onContentChange}
        />
      ) : (
        <PromptCardContent content={content} variant={contentVariant} />
      )}
    </Box>
  );
};
