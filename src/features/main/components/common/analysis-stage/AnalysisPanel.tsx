import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { AnalysisPanelReveal } from "./AnalysisPanelReveal";

type AnalysisPanelProps = {
  intentReveal: number;
  keywordReveal: number;
  summaryReveal: number;
};

// AI analysis card used only inside the analysis stage.
// analysis stage 내부에서만 쓰는 AI 분석 카드
export const AnalysisPanel = ({
  intentReveal,
  keywordReveal,
  summaryReveal,
}: AnalysisPanelProps) => {
  return (
    <Box
      border="1px solid"
      borderColor="seed"
      borderRadius="3xl"
      h={{ base: "auto", xl: "600px" }}
      p={{ base: 5, lg: 12 }}
      w={"full"}
    >
      <VStack align="stretch" gap={4}>
        <Text color="text" fontSize="xl" fontWeight="bold" lineHeight="1.4">
          AI 분석
        </Text>

        <AnalysisPanelReveal
          title="키워드 추출"
          progress={keywordReveal}
          revealHeight={132}
        >
          <VStack align="stretch" gap={1}>
            <Flex gap={2.5} px={2.5} py={2.5} w="full">
              <Box bg="seed.900" h={7} w={15} />
              <Box bg="seed.500" h={7} w={15} />
              <Box bg="seed.500" h={7} w={15} />
              <Box bg="seed.600" h={7} w={15} />
              <Box bg="seed.400" h={7} w={20} />
            </Flex>
          </VStack>
        </AnalysisPanelReveal>

        <AnalysisPanelReveal
          title="문단 요약"
          progress={summaryReveal}
          revealHeight={190}
        >
          <VStack align="stretch" gap={1}>
            <VStack align="stretch" gap={2.5} px={2.5} py={2.5}>
              <Box bg="seed.900" h={7} w="full" />
              <Box bg="seed.500" h={7} w="full" />
              <Flex gap={2.5} w="full">
                <Box bg="seed.600" flex={1} h={7} />
                <Box bg="seed.400" flex={1} h={7} />
              </Flex>
            </VStack>
          </VStack>
        </AnalysisPanelReveal>

        <AnalysisPanelReveal
          title="과제 의도 파악"
          progress={intentReveal}
          revealHeight={190}
        >
          <VStack align="stretch" gap={1}>
            <VStack align="stretch" gap={2.5} px={2.5} py={2.5}>
              <Box bg="seed.900" h={7} w="full" />
              <Flex gap={2.5} w="full">
                <Box bg="seed.600" flex={1} h={7} />
                <Box bg="seed.400" flex={1} h={7} />
              </Flex>
              <Box bg="seed.300" h={15} w="full" />
            </VStack>
          </VStack>
        </AnalysisPanelReveal>
      </VStack>
    </Box>
  );
};
