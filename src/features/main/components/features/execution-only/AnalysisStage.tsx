import type { RefObject } from "react";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import {
  analysisPanelStageStyle,
  fadeUpStyle,
  referencePanelStageStyle,
} from "../../../utils";
import { AnalysisPanel } from "../../common";
import { ReferenceDataPanel } from "../../common";

type AnalysisStageProps = {
  analysisPanelReveal: number;
  analysisStageReveal: number;
  analysisContentRef: RefObject<HTMLDivElement | null>;
  intentReveal: number;
  keywordReveal: number;
  referenceReveal: number;
  resolvedAnalysisHeight: number;
  summaryReveal: number;
};

export const AnalysisStage = ({
  analysisPanelReveal,
  analysisStageReveal,
  analysisContentRef,
  intentReveal,
  keywordReveal,
  referenceReveal,
  resolvedAnalysisHeight,
  summaryReveal,
}: AnalysisStageProps) => {
  return (
    <Box
      maxH={`${(resolvedAnalysisHeight * analysisStageReveal).toFixed(2)}px`}
      opacity={analysisStageReveal}
      overflow="hidden"
      transform={`translateY(${((1 - analysisStageReveal) * 20).toFixed(2)}px)`}
      transition={[
        "max-height 240ms cubic-bezier(0.22, 1, 0.36, 1)",
        "opacity 220ms ease",
        "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
      ].join(", ")}
      w="full"
    >
      <Box ref={analysisContentRef}>
        <VStack align="center" gap={{ base: 8, lg: 12 }} w="full">
          <VStack
            align="center"
            gap={{ base: 8, lg: 12 }}
            w="full"
            {...fadeUpStyle(referenceReveal, 64)}
          >
            <Text
              color="text"
              fontSize={{ base: "3xl", lg: "4xl" }}
              fontWeight="bold"
              lineHeight="1.4"
              textAlign="center"
              whiteSpace="nowrap"
            >
              과제를 등록하면 분석을 시작합니다
            </Text>

            <Box display={{ base: "none", xl: "block" }} w="full">
              <Box h={"600px"} position="relative" w="full">
                <Box
                  left="50%"
                  position="absolute"
                  top="50%"
                  w={"600px"}
                  zIndex={2}
                  {...referencePanelStageStyle(
                    referenceReveal,
                    analysisPanelReveal,
                  )}
                >
                  <ReferenceDataPanel />
                </Box>
                <Box
                  left="50%"
                  position="absolute"
                  top="50%"
                  w={"520px"}
                  zIndex={1}
                  {...analysisPanelStageStyle(analysisPanelReveal)}
                >
                  <AnalysisPanel
                    intentReveal={intentReveal}
                    keywordReveal={keywordReveal}
                    summaryReveal={summaryReveal}
                  />
                </Box>
              </Box>
            </Box>

            <Flex
              align={{ base: "stretch", xl: "center" }}
              direction="column"
              display={{ base: "flex", xl: "none" }}
              gap={6}
              justify="center"
              w="full"
            >
              <ReferenceDataPanel />
              <Box {...fadeUpStyle(analysisPanelReveal, 16)} w="full">
                <AnalysisPanel
                  intentReveal={intentReveal}
                  keywordReveal={keywordReveal}
                  summaryReveal={summaryReveal}
                />
              </Box>
            </Flex>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};
