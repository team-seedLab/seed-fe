import { useMemo, useState } from "react";

import {
  FALLBACK_ANALYSIS_CONTENT_HEIGHT,
  FALLBACK_ROADMAP_CONTENT_HEIGHT,
  SOLUTION_ASSIGNMENT_CARDS,
} from "../constants";
import type { AssignmentTypeId, SolutionAssignmentCard } from "../types";
import { deriveSolutionTimelineState } from "../utils";

import { useObservedHeight } from "./useObservedHeight";
import { useSolutionTimelineProgress } from "./useSolutionTimelineProgress";

type UseExecutionOnlySectionStateParams = {
  isActivated: boolean;
};

const fallbackCardId = (cards: SolutionAssignmentCard[]) => {
  return cards[0]?.id ?? "writing";
};

// 실행만 하세요 섹션 화면 상태 관리
// 섹션 안에 분석 단계랑 로드맵 단계 상태를 조립해서 넘겨줌
export const useExecutionOnlySectionState = ({
  isActivated,
}: UseExecutionOnlySectionStateParams) => {
  const cards = SOLUTION_ASSIGNMENT_CARDS;
  const { progressUnits, sceneRef } = useSolutionTimelineProgress(isActivated);
  const timeline = useMemo(() => {
    return deriveSolutionTimelineState(progressUnits);
  }, [progressUnits]);
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
    setSelectedId(cardId);
  };

  return {
    analysisStageProps: {
      analysisPanelReveal: timeline.analysisPanelReveal,
      analysisStageReveal: timeline.analysisStageReveal,
      analysisContentRef,
      intentReveal: timeline.intentReveal,
      keywordReveal: timeline.keywordReveal,
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
      roadmapListReveal: timeline.roadmapListReveal,
      roadmapTitleReveal: timeline.roadmapTitleReveal,
      resolvedRoadmapHeight,
    },
    sceneRef,
  };
};
