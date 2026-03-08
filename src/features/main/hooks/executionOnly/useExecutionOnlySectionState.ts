import { useMemo, useState } from "react";

import {
  FALLBACK_ANALYSIS_CONTENT_HEIGHT,
  FALLBACK_ROADMAP_CONTENT_HEIGHT,
  SOLUTION_ASSIGNMENT_CARDS,
} from "../../constants/executionOnly";
import type {
  AssignmentTypeId,
  SolutionAssignmentCard,
} from "../../types/executionOnly";
import { deriveSolutionTimelineState } from "../../utils/executionOnly";

import { useObservedHeight } from "./scrollFlow/useObservedHeight";
import { useSolutionTimelineProgress } from "./scrollFlow/useSolutionTimelineProgress";

type UseExecutionOnlySectionStateParams = {
  isActivated: boolean;
};

const fallbackCardId = (cards: SolutionAssignmentCard[]) => {
  return cards[0]?.id ?? "writing";
};

export const useExecutionOnlySectionState = ({
  isActivated,
}: UseExecutionOnlySectionStateParams) => {
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

  return {
    analysisStageProps: {
      analysisPanelReveal: timeline.analysisPanelReveal,
      analysisStageReveal: timeline.analysisStageReveal,
      analysisContentRef,
      intentReveal: timeline.intentReveal,
      keywordReveal: timeline.keywordReveal,
      progressTriggerRef,
      referenceReveal: timeline.referenceReveal,
      resolvedAnalysisHeight,
      summaryReveal: timeline.summaryReveal,
    },
    roadmapStageProps: {
      activeCard,
      activeId,
      cards,
      onSelect: handleSelect,
      roadmapCardsReveal: timeline.roadmapCardsReveal,
      roadmapContainerReveal: timeline.roadmapContainerReveal,
      roadmapContentRef,
      roadmapInteractive,
      roadmapListReveal: timeline.roadmapListReveal,
      roadmapTitleReveal: timeline.roadmapTitleReveal,
      resolvedRoadmapHeight,
    },
  };
};
