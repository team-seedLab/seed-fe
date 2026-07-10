import { Box, Text } from "@chakra-ui/react";

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
};

export const PromptCardContent = ({ content }: Props) => {
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
