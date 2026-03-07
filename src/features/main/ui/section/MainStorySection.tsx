import { useEffect } from "react";

import { MainStorySequence } from "../../components/features/mainStory/MainStorySequence";
import { useMainStorySectionState } from "../../hooks";

type MainStorySectionProps = {
  onSolutionReadyChange?: (isReady: boolean) => void;
};

export const MainStorySection = ({
  onSolutionReadyChange,
}: MainStorySectionProps) => {
  const {
    animatedMessageIds,
    chatRef,
    conversationRef,
    introRef,
    isSolutionActivated: isSolutionReady,
    nextRef,
    storyState,
  } = useMainStorySectionState();

  useEffect(() => {
    onSolutionReadyChange?.(isSolutionReady);
  }, [isSolutionReady, onSolutionReadyChange]);

  return (
    <MainStorySequence
      animatedMessageIds={animatedMessageIds}
      chatRef={chatRef}
      conversationRef={conversationRef}
      introRef={introRef}
      nextRef={nextRef}
      storyState={storyState}
    />
  );
};
