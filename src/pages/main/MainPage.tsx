import {
  ExecutionOnlySection,
  MainStorySection,
  PromptNoHesitationSection,
  WhatToDoSection,
  useMainStorySectionState,
} from "@/features/main";

export default function MainPage() {
  const {
    animatedMessageIds,
    chatRef,
    conversationRef,
    introRef,
    isSolutionActivated,
    nextRef,
    storyState,
  } = useMainStorySectionState();

  return (
    <>
      <MainStorySection
        animatedMessageIds={animatedMessageIds}
        chatRef={chatRef}
        conversationRef={conversationRef}
        introRef={introRef}
        nextRef={nextRef}
        storyState={storyState}
      />
      <ExecutionOnlySection isActivated={isSolutionActivated} />
      <PromptNoHesitationSection />
      <WhatToDoSection />
    </>
  );
}
