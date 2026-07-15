import { type KeyboardEvent, useId, useRef } from "react";

import { Tabs, Textarea, VisuallyHidden } from "@chakra-ui/react";

import { ProjectStepResultContent } from "./ProjectStepResultContent";
import { getMarkdownInputEdit } from "./get-markdown-input-edit";

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
    <Tabs.Root defaultValue="input" variant="plain" w="full">
      <Tabs.List
        alignSelf="flex-start"
        bg="neutral.50"
        borderRadius="full"
        gap={1}
        p={1}
      >
        <Tabs.Trigger
          borderRadius="full"
          color="neutral.500"
          fontSize="sm"
          fontWeight="semibold"
          px={4}
          py={2}
          value="input"
          _selected={{
            bg: "white",
            boxShadow: "sm",
            color: "neutral.900",
          }}
        >
          입력
        </Tabs.Trigger>
        <Tabs.Trigger
          borderRadius="full"
          color="neutral.500"
          fontSize="sm"
          fontWeight="semibold"
          px={4}
          py={2}
          value="preview"
          _selected={{
            bg: "white",
            boxShadow: "sm",
            color: "neutral.900",
          }}
        >
          미리보기
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content p={0} pt={3} value="input">
        <Textarea
          ref={inputRef}
          aria-describedby={tabExitInstructionId}
          aria-label="학습 결과"
          autoresize
          _focusVisible={{
            outline: "none",
            boxShadow: "none",
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

      <Tabs.Content p={0} pt={3} value="preview">
        <ProjectStepResultContent
          content={content}
          emptyMessage="미리보기할 학습 결과가 없습니다."
        />
      </Tabs.Content>
    </Tabs.Root>
  );
};
