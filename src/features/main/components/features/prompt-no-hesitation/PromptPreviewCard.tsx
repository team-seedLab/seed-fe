import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import { CopyIcon, SparklesIcon } from "@/shared";

const promptTemplateLines = [
  {
    accent: "# Role:",
    body: "Academic Writer",
  },
  {
    accent: "# Task:",
    body: "Draft an assignment based on roadmap",
  },
] as const;

// Copy-ready preview card used only inside the prompt assembly section.
// prompt assembly 섹션 내부에서만 쓰는 프롬프트 미리보기 카드
export const PromptPreviewCard = () => {
  return (
    <Box
      bg="container.bg"
      border="1px solid #FAFAFA"
      borderRadius="4xl"
      boxShadow="0px 20px 40px 0px rgba(0, 0, 0, 0.08)"
      px={{ base: 6, lg: 8 }}
      py={{ base: 6, lg: 8 }}
      w="full"
    >
      <VStack align="stretch" gap={6} w="full">
        <Flex align="center" justify="space-between" w="full">
          <HStack align="center" gap={3}>
            <Flex
              align="center"
              bg="container.bg.card"
              borderRadius="full"
              h="40px"
              justify="center"
              w="40px"
            >
              <SparklesIcon color="seed" boxSize="18px" />
            </Flex>

            <VStack align="start" gap={0} minW={0}>
              <Text
                color="#191F28"
                fontSize="14px"
                fontWeight={700}
                letterSpacing="-0.02em"
                lineHeight="20px"
              >
                Step 3 최적화 프롬프트
              </Text>
              <Text
                color="text.secondary"
                fontSize="xs"
                fontWeight="regular"
                letterSpacing="-0.02em"
                lineHeight="16px"
              >
                Professional Mode
              </Text>
            </VStack>
          </HStack>

          <Button
            bg="neutral.900"
            borderRadius="md"
            color="white"
            fontSize="xs"
            fontWeight="bold"
            h="32px"
            minW="auto"
            px={3}
            py={2}
            type="button"
            _hover={{ bg: "#2A3038" }}
          >
            <HStack gap={1.5}>
              <CopyIcon color="white" boxSize="18px" />
              <Text color="inherit" fontSize="xs" fontWeight="bold">
                Copy
              </Text>
            </HStack>
          </Button>
        </Flex>

        <Box
          bg="container.bg"
          border="1px solid #FAFAFA"
          borderRadius="12px"
          px={5}
          py={4}
        >
          <VStack align="start" gap={4} w="full">
            <VStack
              align="start"
              color="text"
              fontFamily="'Courier New', monospace"
              fontSize="sm"
              gap={0}
              lineHeight="22.75px"
              w="full"
            >
              {promptTemplateLines.map(({ accent, body }) => {
                return (
                  <Text key={accent} w="full">
                    <Box as="span" color="seed" fontWeight="bold">
                      {accent}
                    </Box>{" "}
                    <Box as="span">{body}</Box>
                  </Text>
                );
              })}
            </VStack>

            <VStack
              align="start"
              color="text"
              fontFamily="'Courier New', monospace"
              fontSize="sm"
              gap={0}
              lineHeight="22.75px"
              w="full"
            >
              {[
                "[Context]",
                "Based on the previously summarized materials",
                "regarding 'Inflation Impact', please draft a",
                "comprehensive introduction. Include the",
                "following key arguments: ...",
              ].map((line) => {
                return <Text key={line}>{line}</Text>;
              })}
            </VStack>

            <VStack
              align="start"
              color="text"
              fontFamily="'Courier New', monospace"
              fontSize="sm"
              gap={0}
              lineHeight="22.75px"
              w="full"
            >
              {[
                "[Constraints]",
                "- Use formal academic tone.",
                "- Cite sources in APA format.",
              ].map((line) => {
                return <Text key={line}>{line}</Text>;
              })}
            </VStack>
          </VStack>
        </Box>

        <Box borderTop="1px solid #FAFAFA" minH="16px" pt={5} w="full" />
      </VStack>
    </Box>
  );
};
