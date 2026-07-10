import { Box, Text } from "@chakra-ui/react";

import type { PromptDiffLine } from "../../utils";

type Props = {
  lines: PromptDiffLine[];
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

export const PromptDiffContent = ({ lines }: Props) => {
  return (
    <Box
      bg="neutral.50"
      minH={{ base: 60, md: 80 }}
      p={{ base: 4, md: "28px" }}
    >
      {lines.map((line, index) => {
        const style = DIFF_LINE_STYLE[line.type];

        return (
          <Text
            bg={style.bg}
            color={style.color}
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="medium"
            key={`${line.type}-${index}`}
            lineHeight="1.5"
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
