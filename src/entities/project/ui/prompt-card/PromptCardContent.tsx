import { Box, Text } from "@chakra-ui/react";

export type PromptCardContentVariant = "default" | "document";

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

type Props = {
  content: string;
  variant?: PromptCardContentVariant;
};

export const PromptCardContent = ({ content, variant = "default" }: Props) => {
  if (variant === "document") {
    return (
      <Box
        bg="neutral.50"
        minH={{ base: 60, md: "400px" }}
        pb={{ base: 4, md: 6 }}
        pt={{ base: 4, md: 2 }}
        px={{ base: 4, md: 6 }}
      >
        <Text
          color="neutral.900"
          fontSize={{ base: "sm", md: "md" }}
          overflowWrap="anywhere"
          whiteSpace="pre-wrap"
        >
          {content}
        </Text>
      </Box>
    );
  }

  const lines = content.split("\n");
  const isPrompt = lines.some(
    (line) => line.startsWith("# ") || line === "#" || line.startsWith("//"),
  );

  return (
    <Box bg="neutral.50" p={{ base: 4, md: "28px" }}>
      {isPrompt ? (
        lines.map((line, index) => <PromptLine key={index} line={line} />)
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
