import { Box, Flex, Text } from "@chakra-ui/react";

import { CopyIcon, DocumentTextIcon } from "@/shared";

type Props = {
  label: string;
  content: string;
  onCopy: () => void;
  copied?: boolean;
};

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

export const PromptCard = ({
  label,
  content,
  onCopy,
  copied = false,
}: Props) => {
  const lines = content.split("\n");
  const isPrompt = lines.some(
    (line) => line.startsWith("# ") || line === "#" || line.startsWith("//"),
  );

  return (
    <Box
      bg="neutral.50"
      border="1px solid"
      borderColor="neutral.50"
      borderRadius={{ base: "xl", md: "2xl" }}
      overflow="hidden"
      w="full"
    >
      <Flex
        align={{ base: "flex-start", md: "center" }}
        borderBottom="1px solid"
        borderBottomColor="neutral.50"
        direction="row"
        gap={{ base: 3, md: 0 }}
        justify="space-between"
        pb={{ base: 3, md: "17px" }}
        pt={{ base: 3, md: "16px" }}
        px={{ base: 4, md: 6 }}
      >
        <Flex align="center" gap={2}>
          <DocumentTextIcon boxSize={3} color="neutral.600" />
          <Text
            color="neutral.600"
            fontSize={{ base: "2xs", md: "xs" }}
            fontWeight="medium"
          >
            {label}
          </Text>
        </Flex>

        <Box
          as="button"
          alignSelf={{ base: "flex-start", md: "auto" }}
          bg="white"
          border="1px solid"
          borderColor="neutral.50"
          borderRadius="lg"
          boxShadow="0px 1px 2px 0px rgba(0,0,0,0.05)"
          cursor="pointer"
          onClick={onCopy}
          px={{ base: 3, md: "13px" }}
          py={{ base: 1.5, md: "7px" }}
          _hover={{ boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.08)" }}
        >
          <Flex align="center" gap={{ base: 1.5, md: "6px" }}>
            <CopyIcon boxSize={3} color={copied ? "seed" : "neutral.900"} />
            <Text
              color={copied ? "seed" : "neutral.900"}
              fontSize={{ base: "2xs", md: "xs" }}
              fontWeight="semibold"
              lineHeight="1.4"
            >
              {copied ? "복사됨 ✓" : "복사하기"}
            </Text>
          </Flex>
        </Box>
      </Flex>

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
    </Box>
  );
};
