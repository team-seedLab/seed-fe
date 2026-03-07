import type { RefObject } from "react";

import type { MainStoryState } from "../../../utils/deriveMainStoryState";

import { HelpPromptComposer } from "./HelpPromptComposer";
import { HelpPromptConversation } from "./HelpPromptConversation";
import { HelpPromptTitle } from "./HelpPromptTitle";

type HelpPromptSectionProps = {
  animatedMessageIds: ReadonlySet<string>;
  conversationRef: RefObject<HTMLDivElement | null>;
  storyState: MainStoryState;
};

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
