import type { RefObject } from "react";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import type {
  AssignmentTypeId,
  SolutionAssignmentCard,
} from "../../../../types";

import { AssignmentTypeCard } from "./assignmentTypeCard";
import { SolutionRoadmapList } from "./solutionRoadmapList";

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

// Reveals the assignment selector and the active roadmap list after the analysis phase finishes.
// 분석 단계가 끝난 뒤 과제 유형 선택기와 활성 로드맵 목록을 노출
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
            color="#191F28"
            fontSize={{ base: "26px", lg: "36px" }}
            fontWeight={700}
            letterSpacing="-0.02em"
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
              <SolutionRoadmapList card={activeCard} />
            </Box>
          ) : null}
        </VStack>
      </Box>
    </Box>
  );
};
