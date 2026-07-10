import { type FocusEvent, useMemo, useState } from "react";

import { Box, Text, Textarea } from "@chakra-ui/react";

import { createPromptDiff } from "../../utils";

import { PromptCardHeader } from "./PromptCardHeader";
import { PromptDiffContent } from "./PromptDiffContent";

type BaseProps = {
  label: string;
  content: string;
  onCopy: () => void;
  copied?: boolean;
};

type ReadOnlyProps = BaseProps & {
  mode?: "readonly";
};

type EditableProps = BaseProps & {
  mode: "editable";
  originalContent: string;
  onCommit: (content: string) => void;
  onContentChange: (content: string) => void;
  onReset: () => void;
};

type ComparisonProps = BaseProps & {
  mode: "comparison";
  originalContent: string;
};

type Props = ReadOnlyProps | EditableProps | ComparisonProps;

const PromptLine = ({ line }: { line: string }) => {
  let color = "neutral.900";
  if (line.startsWith("# ") || line === "#") {
    color = "seed";
  } else if (line.startsWith("//")) {
    color = "neutral.300";
  }

  return (
    <Text
      as="span"
      color={color}
      display="block"
      fontFamily="mono"
      fontSize={{ base: "xs", md: "sm" }}
      lineHeight="1.5"
    >
      {line}
    </Text>
  );
};

const PromptContent = ({ content }: { content: string }) => {
  const lines = content.split("\n");
  const isPrompt = lines.some(
    (line) => line.startsWith("# ") || line === "#" || line.startsWith("//"),
  );

  return (
    <Box bg="neutral.50" p={{ base: 4, md: "28px" }}>
      {isPrompt ? (
        lines.map((line, i) => <PromptLine key={i} line={line} />)
      ) : (
        <Text
          color="neutral.900"
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="medium"
          lineHeight="1.5"
          whiteSpace="pre-wrap"
        >
          {content}
        </Text>
      )}
    </Box>
  );
};

export const PromptCard = (props: Props) => {
  const { label, content, onCopy, copied = false } = props;
  const mode = props.mode ?? "readonly";
  const originalContent =
    props.mode === "editable" || props.mode === "comparison"
      ? props.originalContent
      : content;
  const [diffViewState, setDiffViewState] = useState({
    isVisible: false,
    originalContent,
  });
  const isDiffVisible =
    diffViewState.originalContent === originalContent &&
    diffViewState.isVisible;
  const diff = useMemo(() => {
    return createPromptDiff(originalContent, content);
  }, [content, originalContent]);

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

    setDiffViewState({
      isVisible: false,
      originalContent,
    });
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
        onToggleDiff={() =>
          setDiffViewState((previousState) => ({
            isVisible:
              previousState.originalContent === originalContent
                ? !previousState.isVisible
                : true,
            originalContent,
          }))
        }
      />

      {isDiffVisible && mode !== "readonly" ? (
        <PromptDiffContent lines={diff.lines} />
      ) : props.mode === "editable" ? (
        <Box
          bg="neutral.50"
          display="flex"
          minH={{ base: 60, md: 80 }}
          p={{ base: 4, md: "28px" }}
        >
          <Textarea
            aria-label={label}
            bg="neutral.50"
            border="none"
            color="neutral.900"
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="medium"
            flex={1}
            lineHeight="1.5"
            minH={0}
            onChange={(event) => props.onContentChange(event.target.value)}
            p={0}
            resize="vertical"
            value={content}
            _focusVisible={{ boxShadow: "none", outline: "none" }}
          />
        </Box>
      ) : (
        <PromptContent content={content} />
      )}
    </Box>
  );
};
