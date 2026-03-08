import { Box, Flex, useMediaQuery } from "@chakra-ui/react";

import type { SolutionAssignmentCard } from "../../../../../types";
import { createFadeUpAnimation } from "../../../../../utils";

import { RoadmapStepCard } from "./roadmapStepCard";

const roadmapSwapInAnimation = createFadeUpAnimation({
  distancePx: 16,
  durationMs: 280,
});

export const SolutionRoadmapList = ({
  card,
}: {
  card: SolutionAssignmentCard;
}) => {
  // 활성 로드맵 카드가 바뀔 때마다 단계 카드 애니메이션을 다시 재생함
  const [reduceMotion] = useMediaQuery(["(prefers-reduced-motion: reduce)"]);

  return (
    <Box w="full">
      <Flex
        animation={reduceMotion ? undefined : roadmapSwapInAnimation}
        direction={{ base: "column", xl: "row" }}
        gap={4}
        justify="center"
        key={card.id}
        w="full"
      >
        {card.roadmapSteps.map((step, index) => {
          return (
            <RoadmapStepCard
              animationDelayMs={index * 60}
              key={`${card.id}-${step.stepNumber}-${step.title}`}
              step={step}
            />
          );
        })}
      </Flex>
    </Box>
  );
};
