import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { AnalysisStage, RoadmapStage } from "../components";
import { INITIAL_TITLE_STAGE_MIN_HEIGHT } from "../constants";
import { EXECUTION_ONLY_SCROLL_DISTANCE_PX } from "../constants";
import { useExecutionOnlySectionState } from "../hooks";

type ExecutionOnlySectionProps = {
  isActivated: boolean;
};

export const ExecutionOnlySection = ({
  isActivated,
}: ExecutionOnlySectionProps) => {
  const { analysisStageProps, roadmapStageProps, sceneRef } =
    useExecutionOnlySectionState({
      isActivated,
    });

  return (
    <Box position="relative" ref={sceneRef} w="full">
      <Box h="fit-content" position="sticky" top={0} w="full">
        <Box bg="white" h="fit-content" overflow="hidden" w="full">
          <VStack
            align="center"
            gap={0}
            h="full"
            maxW={320}
            mx="auto"
            px={{ base: 4, lg: 16 }}
            w="full"
          >
            <Flex
              align="center"
              justify="center"
              minH={INITIAL_TITLE_STAGE_MIN_HEIGHT}
              py={{ base: 14, lg: 20 }}
              w="full"
            >
              <VStack align="center" gap={{ base: 10, lg: 14 }} w="full">
                <Text
                  color="text"
                  fontSize={{ base: "4xl", lg: "5xl" }}
                  fontWeight="bold"
                  letterSpacing="-0.02em"
                  lineHeight="1.4"
                  textAlign="center"
                  whiteSpace="nowrap"
                >
                  프롬프트 고민은{" "}
                  <Box as="span" color="seed">
                    SEED
                  </Box>
                  가 합니다.{" "}
                  <Box as="span" color="seed">
                    실행
                  </Box>
                  만 하세요.
                </Text>

                <AnalysisStage {...analysisStageProps} />
                <RoadmapStage {...roadmapStageProps} />
              </VStack>
            </Flex>
          </VStack>
        </Box>
      </Box>

      <Box h={`${EXECUTION_ONLY_SCROLL_DISTANCE_PX}px`} />
    </Box>
  );
};
