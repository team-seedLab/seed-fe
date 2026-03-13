import type { RefObject } from "react";

import { Box, Flex, Text, VStack, useMediaQuery } from "@chakra-ui/react";

import type { AssignmentTypeId, SolutionAssignmentCard } from "../../../types";
import { createFadeUpAnimation } from "../../../utils";
import { AssignmentTypeCard, RoadmapStepCard } from "../../common";

type RoadmapStageProps = {
  activeCard: SolutionAssignmentCard | undefined;
  activeId: AssignmentTypeId;
  cards: SolutionAssignmentCard[];
  onSelect: (cardId: AssignmentTypeId) => void;
  roadmapCardsReveal: number;
  roadmapContainerReveal: number;
  roadmapListReveal: number;
  roadmapTitleReveal: number;
  resolvedRoadmapHeight: number;
  roadmapContentRef: RefObject<HTMLDivElement | null>;
  roadmapInteractive: boolean;
};

const roadmapSwapInAnimation = createFadeUpAnimation({
  distancePx: 16,
  durationMs: 280,
});

export const RoadmapStage = ({
  activeCard,
  activeId,
  cards,
  onSelect,
  roadmapCardsReveal,
  roadmapContainerReveal,
  roadmapListReveal,
  roadmapTitleReveal,
  resolvedRoadmapHeight,
  roadmapContentRef,
  roadmapInteractive,
}: RoadmapStageProps) => {
  const [reduceMotion] = useMediaQuery(["(prefers-reduced-motion: reduce)"]);

  return (
    <Box
      maxH={`${(resolvedRoadmapHeight * roadmapContainerReveal).toFixed(2)}px`}
      opacity={roadmapContainerReveal}
      overflow="hidden"
      pointerEvents={roadmapContainerReveal > 0.16 ? "auto" : "none"}
      transform={`translateY(${((1 - roadmapContainerReveal) * 24).toFixed(2)}px)`}
      transition={[
        "max-height 240ms cubic-bezier(0.22, 1, 0.36, 1)",
        "opacity 220ms ease",
        "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
      ].join(", ")}
      w="full"
    >
      <Box ref={roadmapContentRef}>
        <VStack
          align="center"
          gap={10}
          pb={{ base: 6, lg: 12 }}
          pt={{ base: 10, lg: 14 }}
        >
          <Text
            color="text"
            fontSize={{ base: "2xl", lg: "4xl" }}
            fontWeight="bold"
            lineHeight="1.4"
            opacity={roadmapTitleReveal}
            textAlign="center"
            transform={`translateY(${((1 - roadmapTitleReveal) * 14).toFixed(2)}px)`}
          >
            과제물 분석을 통해 최적의 로드맵을 제공합니다.
          </Text>

          <Box
            opacity={roadmapCardsReveal}
            transform={`translateY(${((1 - roadmapCardsReveal) * 12).toFixed(2)}px)`}
            w="full"
            mb={10}
          >
            <Flex
              gap={4}
              justify="center"
              w="full"
              wrap={{ base: "wrap", lg: "nowrap" }}
            >
              {cards.map((card) => (
                <AssignmentTypeCard
                  card={card}
                  isActive={activeId === card.id}
                  isInteractive={roadmapInteractive}
                  key={card.id}
                  onSelect={onSelect}
                />
              ))}
            </Flex>
          </Box>

          {activeCard ? (
            <Box
              opacity={roadmapListReveal}
              pt={{ base: 2, lg: 4 }}
              transform={`translateY(${((1 - roadmapListReveal) * 16).toFixed(2)}px)`}
              w="full"
            >
              <Box w="full">
                <Flex
                  animation={reduceMotion ? undefined : roadmapSwapInAnimation}
                  direction={{ base: "column", xl: "row" }}
                  gap={4}
                  justify="center"
                  key={activeCard.id}
                  w="full"
                >
                  {activeCard.roadmapSteps.map((step, index) => {
                    return (
                      <RoadmapStepCard
                        animationDelayMs={index * 60}
                        key={`${activeCard.id}-${step.stepNumber}-${step.title}`}
                        step={step}
                      />
                    );
                  })}
                </Flex>
              </Box>
            </Box>
          ) : null}
        </VStack>
      </Box>
    </Box>
  );
};
