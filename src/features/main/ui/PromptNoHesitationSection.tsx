import { Box, Flex, VStack } from "@chakra-ui/react";

import { ActionableOutputPanel, PromptPreviewCard } from "../components";

export const PromptNoHesitationSection = () => {
  return (
    <Box bg="white" py={{ base: 16, md: 20, lg: 24 }} w="full">
      <VStack align="stretch" gap={12} maxW="1200px" mx="auto" px={10} w="full">
        <VStack align="start" gap={3} maxW="780px" w="full">
          <Box
            as="h2"
            color="#0A0A0A"
            fontSize={{ base: "32px", lg: "48px" }}
            fontWeight={700}
            letterSpacing="-0.02em"
            lineHeight="1.4"
          >
            프롬프트 창 앞에서 망설이지 마세요.
            <br />
            정답은 이미 SEED에 있습니다.
          </Box>
          <Box
            as="p"
            color="#525252"
            fontSize={{ base: "16px", lg: "20px" }}
            fontWeight={500}
            letterSpacing="-0.02em"
            lineHeight="1.4"
          >
            수만 개의 성공적인 프롬프트 데이터와 당신의 과제물의 분석을 통해
            <br />각 로드맵에 최적화된 프롬프트를 제공합니다.
          </Box>
        </VStack>

        <Flex
          align={{ base: "stretch", xl: "center" }}
          direction={{ base: "column", xl: "row" }}
          gap={{ base: 10, xl: 16 }}
          px={{ base: 0, lg: 6 }}
          py={{ base: 0, lg: 6 }}
          w="full"
        >
          <Box flex="1 1 0" minW={0}>
            <PromptPreviewCard />
          </Box>
          <ActionableOutputPanel />
        </Flex>
      </VStack>
    </Box>
  );
};
