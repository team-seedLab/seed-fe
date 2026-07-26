import { Flex, Grid, Text, VStack } from "@chakra-ui/react";

import type { MentorProjectDependencyAnalysis } from "@/entities";

import { MentorProjectAiDependencyChart } from "./MentorProjectAiDependencyChart";

type Props = {
  metrics: MentorProjectDependencyAnalysis | null;
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
          프롬프트 수정 정도와 AI 멘토 질문 사용량, 수정 프롬프트 재질문 비율을
          바탕으로 학습 과정의 주도성과 AI 의존도를 보여줍니다.
        </Text>

        {metrics ? (
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
              minH={32}
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
                  {metrics.initiativeScore}
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
              minH={32}
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
                {metrics.userEditRatio}%
              </Text>
            </VStack>
          </Grid>
        ) : (
          <Flex
            align="center"
            bg="neutral.50"
            borderRadius="2xl"
            justify="center"
            minH={32}
            p={6}
            mt={{ base: 3, md: 5 }}
          >
            <Text color="neutral.500" fontSize="sm" textAlign="center">
              AI 의존도 분석 결과가 아직 생성되지 않았습니다.
            </Text>
          </Flex>
        )}
      </VStack>

      {metrics && (
        <MentorProjectAiDependencyChart value={metrics.aiDependencyRatio} />
      )}
    </Flex>
  );
};
