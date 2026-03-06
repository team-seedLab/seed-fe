import { useMemo, useState } from "react";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { COPY } from "../../../../../model/promptStoryData";
import { AnalysisStage } from "../../analysisStage/ui/AnalysisStage";
import { RoadmapStage } from "../../roadmapStage/ui/RoadmapStage";
import {
  FALLBACK_ANALYSIS_CONTENT_HEIGHT,
  FALLBACK_ROADMAP_CONTENT_HEIGHT,
  INITIAL_TITLE_STAGE_MIN_HEIGHT,
} from "../../solutionProgressLayout/common/solutionProgressLayout";
import { SOLUTION_ASSIGNMENT_CARDS } from "../../solutionRoadmapData/common/solutionRoadmapData";
import { deriveSolutionTimelineState } from "../../solutionTimeline/common/solutionTimeline";
import { useSolutionTimelineProgress } from "../../solutionTimelineProgress/common/useSolutionTimelineProgress";
import type {
  AssignmentTypeId,
  SolutionAssignmentCard,
} from "../../types/common/types";
import { useObservedHeight } from "../common/observedHeight/common/useObservedHeight";

type SolutionProgressPanelProps = {
  isActivated: boolean;
};

const fallbackCardId = (cards: SolutionAssignmentCard[]) => {
  return cards[0]?.id ?? "writing";
};

// Orchestrates the title, analysis reveal, and roadmap reveal for the solution section.
// solution 섹션의 제목, 분석 단계, 로드맵 단계를 순서대로 조립하는 상위 패널
export const SolutionProgressPanel = ({
  isActivated,
}: SolutionProgressPanelProps) => {
  const cards = SOLUTION_ASSIGNMENT_CARDS;
  const { progressUnits, progressTriggerRef } =
    useSolutionTimelineProgress(isActivated);
  const timeline = useMemo(() => {
    return deriveSolutionTimelineState(progressUnits);
  }, [progressUnits]);
  const roadmapInteractive = timeline.roadmapCardsReveal >= 0.8;
  const [selectedId, setSelectedId] = useState<AssignmentTypeId>(() => {
    return cards.some((card) => card.id === "writing")
      ? "writing"
      : fallbackCardId(cards);
  });
  const activeId = cards.some((card) => card.id === selectedId)
    ? selectedId
    : fallbackCardId(cards);
  const activeCard = cards.find((card) => card.id === activeId) ?? cards[0];

  const {
    contentRef: analysisContentRef,
    resolvedHeight: resolvedAnalysisHeight,
  } = useObservedHeight<HTMLDivElement>({
    fallbackHeight: FALLBACK_ANALYSIS_CONTENT_HEIGHT,
    watchKey: "analysis-stage",
  });
  const {
    contentRef: roadmapContentRef,
    resolvedHeight: resolvedRoadmapHeight,
  } = useObservedHeight<HTMLDivElement>({
    fallbackHeight: FALLBACK_ROADMAP_CONTENT_HEIGHT,
    watchKey: `${activeId}-${cards.length}`,
  });

  const handleSelect = (cardId: AssignmentTypeId) => {
    if (!roadmapInteractive) {
      return;
    }

    setSelectedId(cardId);
  };

  return (
    <Box bg="white" overflow="hidden" w="full">
      <VStack
        align="center"
        gap={0}
        maxW="1280px"
        mx="auto"
        pb={{ base: 14, lg: 20 }}
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
              color="#191F28"
              fontSize={{ base: "32px", lg: "48px" }}
              fontWeight={700}
              letterSpacing="-0.02em"
              lineHeight="1.4"
              textAlign="center"
              whiteSpace="nowrap"
            >
              {COPY.solutionTitle.prefix}
              <Box as="span" color="#75AC36">
                {COPY.solutionTitle.logo}
              </Box>
              {COPY.solutionTitle.middle}
              <Box as="span" color="#75AC36">
                {COPY.solutionTitle.highlight}
              </Box>
              {COPY.solutionTitle.suffix}
            </Text>

            <AnalysisStage
              analysisContentRef={analysisContentRef}
              progressTriggerRef={progressTriggerRef}
              resolvedAnalysisHeight={resolvedAnalysisHeight}
              timeline={timeline}
            />
            <RoadmapStage
              activeCard={activeCard}
              activeId={activeId}
              cards={cards}
              onSelect={handleSelect}
              resolvedRoadmapHeight={resolvedRoadmapHeight}
              roadmapContentRef={roadmapContentRef}
              roadmapInteractive={roadmapInteractive}
              timeline={timeline}
            />
          </VStack>
        </Flex>
      </VStack>
    </Box>
  );
};
