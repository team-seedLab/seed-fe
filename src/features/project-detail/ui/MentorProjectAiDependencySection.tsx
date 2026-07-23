import { Flex, Grid, Text, VStack } from "@chakra-ui/react";

import type { MentorProjectAiDependencyMetrics } from "../types";

import { MentorProjectAiDependencyChart } from "./MentorProjectAiDependencyChart";

type Props = {
  metrics: MentorProjectAiDependencyMetrics;
};

export const MentorProjectAiDependencySection = ({ metrics }: Props) => {
  return (
    <Flex
      align="center"
      bg="white"
      border="1px solid"
      borderColor="neutral.50"
      borderRadius="3xl"
      boxShadow="0px 4px 12px 0px rgba(0,0,0,0.04)"
      direction={{ base: "column", lg: "row" }}
      gap={{ base: 8, md: 12 }}
      p={{ base: 5, md: "25px" }}
      w="full"
    >
      <VStack align="stretch" flex={1} gap={3} w="full">
        <Text
          as="h2"
          color="neutral.900"
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
        >
          AI 의존도 분석
        </Text>
        <Text
          color="neutral.700"
          fontSize="sm"
          fontWeight="medium"
          maxW="576px"
          wordBreak="keep-all"
        >
          전체 작업 과정에서 본인의 수정 비율과 AI 생성물의 유지 비율을
          보여줍니다. 결과물이 아닌 과정의 주도성을 확인하세요.
        </Text>

        <Grid
          gap={{ base: 3, md: 6 }}
          pt={{ base: 3, md: 5 }}
          templateColumns={{ base: "1fr", sm: "repeat(2, minmax(0, 1fr))" }}
        >
          <VStack
            bg="neutral.50"
            borderRadius="2xl"
            gap={1.5}
            justify="center"
            minH={31}
            p={6}
          >
            <Text color="neutral.600" fontSize="sm" fontWeight="semibold">
              주도성 점수
            </Text>
            <Flex align="baseline" gap={1}>
              <Text
                color="seed"
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                lineHeight="1.2"
              >
                {metrics.agencyScore}
              </Text>
              <Text color="neutral.600" fontSize="md">
                /100
              </Text>
            </Flex>
          </VStack>

          <VStack
            bg="neutral.50"
            borderRadius="2xl"
            gap={1.5}
            justify="center"
            minH={31}
            p={6}
          >
            <Text color="neutral.600" fontSize="sm" fontWeight="semibold">
              직접 수정 비율
            </Text>
            <Text
              color="neutral.900"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              lineHeight="1.2"
            >
              {metrics.directEditRate}%
            </Text>
          </VStack>
        </Grid>
      </VStack>

      <MentorProjectAiDependencyChart value={metrics.aiDependencyRate} />
    </Flex>
  );
};
