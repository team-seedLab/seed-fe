import type { AssignmentHelpState } from "../../../../types/assignmentHelp";

import { AssignmentHelpComposer } from "./AssignmentHelpComposer";
import { AssignmentHelpConversation } from "./AssignmentHelpConversation";
import { AssignmentHelpTitle } from "./AssignmentHelpTitle";
import { useAssignmentHelpPromptSceneState } from "./useAssignmentHelpPromptSceneState";

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
