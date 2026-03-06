import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

import type { SolutionAssignmentCard } from "../../../../types/common/types";
import { RoadmapStepCard } from "../common/roadmapStepCard/ui/RoadmapStepCard";

const roadmapSwapIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(16px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const SolutionRoadmapList = ({
  card,
}: {
  card: SolutionAssignmentCard;
}) => {
  // Replays the step animation whenever the active roadmap card changes.
  // 활성 로드맵 카드가 바뀔 때마다 단계 카드 애니메이션을 다시 재생
  const [reduceMotion] = useMediaQuery(["(prefers-reduced-motion: reduce)"]);

  return (
    <Box w="full">
      <Flex
        animation={
          reduceMotion
            ? undefined
            : `${roadmapSwapIn} 280ms cubic-bezier(0.22, 1, 0.36, 1) both`
        }
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
