import { type ReactNode, createElement } from "react";

import { Button, HStack } from "@chakra-ui/react";
import "@github/markdown-toolbar-element";

import {
  PROJECT_CONTENT_CONTROL_BASE_STYLE,
  PROJECT_CONTENT_CONTROL_SURFACE_STYLE,
} from "../project-content-control-style";

const MARKDOWN_CONTROLS = [
  { command: "header-3", label: "제목", text: "제목" },
  { command: "bold", label: "굵게", text: "굵게" },
  { command: "italic", label: "기울임", text: "기울임" },
  { command: "link", label: "링크", text: "링크" },
  { command: "unordered-list", label: "글머리 목록", text: "글머리" },
  { command: "ordered-list", label: "번호 목록", text: "번호" },
  { command: "quote", label: "인용", text: "인용" },
  { command: "code", label: "인라인 코드", text: "코드" },
] as const;

type Props = {
  textareaId: string;
};

const createMarkdownToolbar = (textareaId: string, children: ReactNode) =>
  createElement(
    "markdown-toolbar",
    {
      "aria-label": "마크다운 서식",
      for: textareaId,
      style: { display: "block", width: "100%" },
    },
    children,
  );

export const ProjectStepResultToolbar = ({ textareaId }: Props) =>
  createMarkdownToolbar(
    textareaId,
    <HStack gap={1} overflowX="auto" pb={1} scrollbar="hidden" w="full">
      {MARKDOWN_CONTROLS.map(({ command, label, text }) => (
        <Button
          {...PROJECT_CONTENT_CONTROL_BASE_STYLE}
          {...PROJECT_CONTENT_CONTROL_SURFACE_STYLE}
          aria-label={label}
          color="neutral.700"
          data-md-button={command}
          flexShrink={0}
          key={command}
          type="button"
          variant="ghost"
          _focusVisible={{
            outline: "2px solid",
            outlineColor: "seed",
            outlineOffset: "2px",
          }}
          _hover={{ bg: "neutral.50" }}
        >
          {text}
        </Button>
      ))}
    </HStack>,
  );
