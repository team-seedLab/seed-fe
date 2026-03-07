import { useMemo, useState } from "react";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { AnalysisStage } from "../../components/features/executionOnly/analysisStage/ui/AnalysisStage";
import { EXECUTION_ONLY_COPY } from "../../components/features/executionOnly/data/executionOnlyCopy";
import { SOLUTION_ASSIGNMENT_CARDS } from "../../components/features/executionOnly/data/solutionRoadmapData";
import { RoadmapStage } from "../../components/features/executionOnly/roadmapStage/ui/RoadmapStage";
import { useObservedHeight } from "../../components/features/executionOnly/scrollFlow/hooks/useObservedHeight";
import { useSolutionTimelineProgress } from "../../components/features/executionOnly/scrollFlow/hooks/useSolutionTimelineProgress";
import {
  FALLBACK_ANALYSIS_CONTENT_HEIGHT,
  FALLBACK_ROADMAP_CONTENT_HEIGHT,
  INITIAL_TITLE_STAGE_MIN_HEIGHT,
} from "../../components/features/executionOnly/scrollFlow/solutionProgressLayout";
import { deriveSolutionTimelineState } from "../../components/features/executionOnly/scrollFlow/solutionTimeline";
import type {
  AssignmentTypeId,
  SolutionAssignmentCard,
} from "../../components/features/executionOnly/types/executionOnly";

type ExecutionOnlySectionProps = {
  isActivated: boolean;
};

const fallbackCardId = (cards: SolutionAssignmentCard[]) => {
  return cards[0]?.id ?? "writing";
};

export const ExecutionOnlySection = ({
  isActivated,
}: ExecutionOnlySectionProps) => {
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
              {EXECUTION_ONLY_COPY.solutionTitle.prefix}
              <Box as="span" color="#75AC36">
                {EXECUTION_ONLY_COPY.solutionTitle.logo}
              </Box>
              {EXECUTION_ONLY_COPY.solutionTitle.middle}
              <Box as="span" color="#75AC36">
                {EXECUTION_ONLY_COPY.solutionTitle.highlight}
              </Box>
              {EXECUTION_ONLY_COPY.solutionTitle.suffix}
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
