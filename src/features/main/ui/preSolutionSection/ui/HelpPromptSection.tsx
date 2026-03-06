import type { RefObject } from "react";

import type { MainStoryState } from "../../../model/deriveMainStoryState";
import { HelpPromptComposer } from "../common/helpPromptComposer/ui/HelpPromptComposer";
import { HelpPromptConversation } from "../common/helpPromptConversation/ui/HelpPromptConversation";
import { HelpPromptTitle } from "../common/helpPromptTitle/ui/HelpPromptTitle";

type HelpPromptSectionProps = {
  animatedMessageIds: ReadonlySet<string>;
  conversationRef: RefObject<HTMLDivElement | null>;
  storyState: MainStoryState;
};

// Renders the opening "과제 도와줘" story with the title, chat transcript, and composer prompt.
// 제목, 채팅, 입력창으로 구성된 첫 번째 "과제 도와줘" 스토리 섹션
export const HelpPromptSection = ({
  animatedMessageIds,
  conversationRef,
  storyState,
}: HelpPromptSectionProps) => {
  return (
    <>
      <HelpPromptTitle title={storyState.title} />
      <HelpPromptConversation
        animatedMessageIds={animatedMessageIds}
        chat={storyState.chat}
        conversationRef={conversationRef}
        isChatVisible={storyState.flags.isChatVisible}
      />
      <HelpPromptComposer composer={storyState.composer} />
    </>
  );
};
