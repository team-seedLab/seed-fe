import { Box, Text } from "@chakra-ui/react";

import type { PromptDiffLine } from "../../utils";

import type { PromptCardContentVariant } from "./PromptCardContent";

type Props = {
  lines: PromptDiffLine[];
  variant?: PromptCardContentVariant;
};

const DIFF_LINE_STYLE = {
  added: {
    bg: "seed.subtle",
    color: "seed.hover",
    prefix: "+ ",
  },
  removed: {
    bg: "pdf.bg",
    color: "pdf",
    prefix: "- ",
  },
  unchanged: {
    bg: "transparent",
    color: "neutral.900",
    prefix: "",
  },
} as const;

export const PromptDiffContent = ({ lines, variant = "default" }: Props) => {
  const isDocument = variant === "document";

  return (
    <Box
      bg="neutral.50"
      minH={isDocument ? { base: 60, md: "400px" } : { base: 60, md: 80 }}
      pb={isDocument ? { base: 4, md: 6 } : { base: 4, md: "28px" }}
      pt={isDocument ? { base: 4, md: 2 } : { base: 4, md: "28px" }}
      px={isDocument ? { base: 4, md: 6 } : { base: 4, md: "28px" }}
    >
      {lines.map((line, index) => {
        const style = DIFF_LINE_STYLE[line.type];

        return (
          <Text
            bg={style.bg}
            color={style.color}
            fontSize={
              isDocument ? { base: "sm", md: "md" } : { base: "xs", md: "sm" }
            }
            fontWeight={isDocument ? "normal" : "medium"}
            key={`${line.type}-${index}`}
            lineHeight={isDocument ? undefined : "1.5"}
            overflowWrap="anywhere"
            px={line.type === "unchanged" ? 0 : 1}
            whiteSpace="pre-wrap"
          >
            {style.prefix}
            {line.content || " "}
          </Text>
        );
      })}
    </Box>
  );
};
