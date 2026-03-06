import type { RefObject } from "react";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { SolutionRoadmapList } from "../../solutionProgressPanel/common/solutionRoadmapList/ui/SolutionRoadmapList";
import type { SolutionTimelineState } from "../../solutionTimeline/common/solutionTimeline";
import type {
  AssignmentTypeId,
  SolutionAssignmentCard,
} from "../../types/common/types";
import { AssignmentTypeCard } from "../common/assignmentTypeCard/ui/AssignmentTypeCard";

type RoadmapStageProps = {
  activeCard: SolutionAssignmentCard | undefined;
  activeId: AssignmentTypeId;
  cards: SolutionAssignmentCard[];
  onSelect: (cardId: AssignmentTypeId) => void;
  resolvedRoadmapHeight: number;
  roadmapContentRef: RefObject<HTMLDivElement | null>;
  roadmapInteractive: boolean;
  timeline: SolutionTimelineState;
};

// Reveals the assignment selector and the active roadmap list after the analysis phase finishes.
// 분석 단계가 끝난 뒤 과제 유형 선택기와 활성 로드맵 목록을 노출
export const RoadmapStage = ({
  activeCard,
  activeId,
  cards,
  onSelect,
  resolvedRoadmapHeight,
  roadmapContentRef,
  roadmapInteractive,
  timeline,
}: RoadmapStageProps) => {
  return (
    <Box
      maxH={`${(resolvedRoadmapHeight * timeline.roadmapContainerReveal).toFixed(2)}px`}
      opacity={timeline.roadmapContainerReveal}
      overflow="hidden"
      pointerEvents={timeline.roadmapContainerReveal > 0.16 ? "auto" : "none"}
      transform={`translateY(${((1 - timeline.roadmapContainerReveal) * 24).toFixed(2)}px)`}
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
          gap={6}
          pb={{ base: 6, lg: 12 }}
          pt={{ base: 10, lg: 14 }}
        >
          <Text
            color="#191F28"
            fontSize={{ base: "26px", lg: "36px" }}
            fontWeight={700}
            letterSpacing="-0.02em"
            lineHeight="1.4"
            opacity={timeline.roadmapTitleReveal}
            textAlign="center"
            transform={`translateY(${((1 - timeline.roadmapTitleReveal) * 14).toFixed(2)}px)`}
          >
            과제물 분석을 통해 최적의 로드맵을 제공합니다.
          </Text>

          <Box
            opacity={timeline.roadmapCardsReveal}
            transform={`translateY(${((1 - timeline.roadmapCardsReveal) * 12).toFixed(2)}px)`}
            w="full"
          >
            <Flex
              gap={4.5}
              justify="center"
              maxW="1088px"
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
              opacity={timeline.roadmapListReveal}
              pt={{ base: 2, lg: 4 }}
              transform={`translateY(${((1 - timeline.roadmapListReveal) * 16).toFixed(2)}px)`}
              w="full"
            >
              <SolutionRoadmapList card={activeCard} />
            </Box>
          ) : null}
        </VStack>
      </Box>
    </Box>
  );
};
