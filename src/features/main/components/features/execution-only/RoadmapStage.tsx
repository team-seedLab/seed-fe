import type { RefObject } from "react";

import { Box, Flex, Text, VStack, useMediaQuery } from "@chakra-ui/react";

import type { AssignmentTypeId, SolutionAssignmentCard } from "../../../types";
import {
  createFadeUpAnimation,
  fadeUpStyleDesktopOnly,
  stageContainerStyle,
} from "../../../utils";
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
}: RoadmapStageProps) => {
  const [reduceMotion] = useMediaQuery(["(prefers-reduced-motion: reduce)"]);

  return (
    <Box
      {...stageContainerStyle(
        roadmapContainerReveal,
        resolvedRoadmapHeight,
        24,
      )}
      pointerEvents={{
        base: "auto",
        xl: roadmapContainerReveal > 0.16 ? "auto" : "none",
      }}
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
            textAlign="center"
            {...fadeUpStyleDesktopOnly(roadmapTitleReveal, 14)}
          >
            과제물 분석을 통해
            <Box as="br" display={{ base: "block", md: "none" }} />
            <Box as="span" color="seed" fontSize={{ base: "3xl", lg: "5xl" }}>
              {" "}
              최적의 로드맵{" "}
            </Box>
            을 제공합니다.
          </Text>

          <Box
            {...fadeUpStyleDesktopOnly(roadmapCardsReveal, 12)}
            w="full"
            mb={10}
          >
            <Flex
              gap={4}
              justify="center"
              w="full"
              wrap={{ base: "wrap", md: "nowrap" }}
            >
              {cards.map((card) => (
                <AssignmentTypeCard
                  card={card}
                  isActive={activeId === card.id}
                  key={card.id}
                  onSelect={onSelect}
                />
              ))}
            </Flex>
          </Box>

          {activeCard ? (
            <Box
              {...fadeUpStyleDesktopOnly(roadmapListReveal, 16)}
              w="full"
              pt={{ base: 2, lg: 4 }}
            >
              <Box w="full">
                <Flex
                  animation={reduceMotion ? undefined : roadmapSwapInAnimation}
                  direction={{ base: "column", md: "row" }}
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
