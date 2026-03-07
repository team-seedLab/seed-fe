import type { AssignmentHelpState } from "../../types/assignmentHelp";
import { AssignmentHelpComposer } from "../composer/ui/AssignmentHelpComposer";
import { AssignmentHelpConversation } from "../conversation/ui/AssignmentHelpConversation";
import { useAssignmentHelpPromptSceneState } from "../hooks/useAssignmentHelpPromptSceneState";
import { AssignmentHelpTitle } from "../title/ui/AssignmentHelpTitle";

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
