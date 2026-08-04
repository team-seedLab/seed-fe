import { type ReactNode, createElement } from "react";

import { HStack } from "@chakra-ui/react";
import "@github/markdown-toolbar-element";

import {
  BoldIcon,
  CodeIcon,
  HeadingIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  ListNumberIcon,
  QuoteIcon,
} from "@/shared";

import { PROJECT_CONTENT_CONTROL_SURFACE_STYLE } from "../project-content-control-style";

import { ProjectStepResultToolbarButton } from "./ProjectStepResultToolbarButton";

const MARKDOWN_CONTROLS = [
  { command: "header-3", Icon: HeadingIcon, label: "제목" },
  { command: "bold", Icon: BoldIcon, label: "굵게" },
  { command: "italic", Icon: ItalicIcon, label: "기울임" },
  { command: "link", Icon: LinkIcon, label: "링크" },
  {
    command: "unordered-list",
    Icon: ListBulletIcon,
    label: "글머리 목록",
  },
  { command: "ordered-list", Icon: ListNumberIcon, label: "번호 목록" },
  { command: "quote", Icon: QuoteIcon, label: "인용" },
  { command: "code", Icon: CodeIcon, label: "인라인 코드" },
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
      style: { display: "block", minWidth: 0, width: "100%" },
    },
    children,
  );

export const ProjectStepResultToolbar = ({ textareaId }: Props) =>
  createMarkdownToolbar(
    textareaId,
    <HStack
      {...PROJECT_CONTENT_CONTROL_SURFACE_STYLE}
      borderRadius="full"
      gap={0.5}
      maxW="full"
      ml="auto"
      overflowX="auto"
      p={1}
      scrollbar="hidden"
      w="fit-content"
    >
      {MARKDOWN_CONTROLS.map(({ command, Icon, label }) => (
        <ProjectStepResultToolbarButton
          command={command}
          key={command}
          label={label}
        >
          <Icon boxSize={4} />
        </ProjectStepResultToolbarButton>
      ))}
    </HStack>,
  );
