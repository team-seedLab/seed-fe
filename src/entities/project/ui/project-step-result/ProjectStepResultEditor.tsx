import { type KeyboardEvent, useId, useRef, useState } from "react";

import { Tabs, Textarea, VisuallyHidden } from "@chakra-ui/react";

import {
  PROJECT_CONTENT_CONTROL_BASE_STYLE,
  PROJECT_CONTENT_CONTROL_SURFACE_STYLE,
} from "../project-content-control-style";

import { ProjectStepResultContent } from "./ProjectStepResultContent";
import { getMarkdownInputEdit } from "./get-markdown-input-edit";
import { useProjectStepResultInputViewHeight } from "./useProjectStepResultInputViewHeight";

type Props = {
  content: string;
  onContentChange: (content: string) => void;
};

export const ProjectStepResultEditor = ({
  content,
  onContentChange,
}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const shouldReleaseTabRef = useRef(false);
  const tabExitInstructionId = useId();
  const [selectedView, setSelectedView] = useState<"input" | "preview">(
    "input",
  );
  const { inputViewHeight, inputViewRef } =
    useProjectStepResultInputViewHeight();

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Escape") {
      shouldReleaseTabRef.current = true;
      return;
    }

    if (event.key === "Tab" && shouldReleaseTabRef.current) {
      shouldReleaseTabRef.current = false;
      return;
    }

    shouldReleaseTabRef.current = false;

    const edit = getMarkdownInputEdit({
      ctrlKey: event.ctrlKey,
      key: event.key,
      metaKey: event.metaKey,
      selectionEnd: event.currentTarget.selectionEnd,
      selectionStart: event.currentTarget.selectionStart,
      shiftKey: event.shiftKey,
      value: content,
    });

    if (!edit) {
      return;
    }

    event.preventDefault();
    onContentChange(edit.value);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(
        edit.selectionStart,
        edit.selectionEnd,
      );
    });
  };

  return (
    <Tabs.Root
      onValueChange={({ value }) => {
        if (value === "input" || value === "preview") {
          setSelectedView(value);
        }
      }}
      value={selectedView}
      variant="plain"
      w="full"
    >
      <Tabs.List
        alignSelf="flex-start"
        bg="neutral.50"
        borderColor="neutral.100"
        borderRadius="full"
        css={{
          "--transition-duration": "180ms",
          "--transition-timing-function": "ease-out",
          "@media (prefers-reduced-motion: reduce)": {
            "--transition-duration": "0ms",
          },
        }}
        gap="4px"
        p="4px"
      >
        <Tabs.Indicator
          {...PROJECT_CONTENT_CONTROL_SURFACE_STYLE}
          borderRadius={PROJECT_CONTENT_CONTROL_BASE_STYLE.borderRadius}
        />
        <Tabs.Trigger
          {...PROJECT_CONTENT_CONTROL_BASE_STYLE}
          color="neutral.600"
          value="input"
          zIndex={1}
          _focusVisible={{
            outline: "2px solid",
            outlineColor: "seed",
            outlineOffset: "2px",
          }}
          _selected={{
            color: "neutral.900",
          }}
        >
          입력
        </Tabs.Trigger>
        <Tabs.Trigger
          {...PROJECT_CONTENT_CONTROL_BASE_STYLE}
          color="neutral.600"
          value="preview"
          zIndex={1}
          _focusVisible={{
            outline: "2px solid",
            outlineColor: "seed",
            outlineOffset: "2px",
          }}
          _selected={{
            color: "neutral.900",
          }}
        >
          미리보기
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content ref={inputViewRef} p={0} pt={3} value="input">
        <Textarea
          ref={inputRef}
          aria-describedby={tabExitInstructionId}
          aria-label="학습 결과"
          autoresize
          _focusVisible={{
            outline: "none",
            boxShadow: "0 0 0 1px var(--sd-colors-seed)",
          }}
          _placeholder={{ color: "neutral.300" }}
          bg="neutral.50"
          border="none"
          borderRadius="xl"
          color="neutral.900"
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="medium"
          minH={60}
          onBlur={() => {
            shouldReleaseTabRef.current = false;
          }}
          onChange={(event) => onContentChange(event.target.value)}
          onKeyDown={handleKeyDown}
          p={{ base: 4, md: 6 }}
          placeholder="이번 단계에서 학습한 내용과 결과를 자유롭게 정리해 주세요."
          value={content}
        />
        <VisuallyHidden id={tabExitInstructionId}>
          Escape를 누른 뒤 Tab 키를 누르면 입력창을 벗어날 수 있습니다.
        </VisuallyHidden>
      </Tabs.Content>

      <Tabs.Content
        p={0}
        pt={3}
        style={{ minHeight: inputViewHeight ?? undefined }}
        value="preview"
      >
        {selectedView === "preview" && (
          <ProjectStepResultContent
            content={content}
            emptyMessage="미리보기할 학습 결과가 없습니다."
          />
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
};
