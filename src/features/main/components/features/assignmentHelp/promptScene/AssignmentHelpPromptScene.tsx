import { useAssignmentHelpPromptSceneState } from "../../../../hooks";
import type { AssignmentHelpState } from "../../../../types";

import { AssignmentHelpComposer } from "./composer";
import { AssignmentHelpConversation } from "./conversation";
import { AssignmentHelpTitle } from "./title";

type AssignmentHelpPromptSceneProps = {
  chat: AssignmentHelpState["chat"];
  composer: AssignmentHelpState["composer"];
  isChatVisible: AssignmentHelpState["flags"]["isChatVisible"];
  title: AssignmentHelpState["title"];
};

export const AssignmentHelpPromptScene = ({
  chat,
  composer,
  isChatVisible,
  title,
}: AssignmentHelpPromptSceneProps) => {
  const { animatedMessageIds, conversationRef } =
    useAssignmentHelpPromptSceneState({
      chat,
    });

  return (
    <>
      <AssignmentHelpTitle title={title} />
      <AssignmentHelpConversation
        animatedMessageIds={animatedMessageIds}
        chat={chat}
        conversationRef={conversationRef}
        isChatVisible={isChatVisible}
      />
      <AssignmentHelpComposer composer={composer} />
    </>
  );
};
