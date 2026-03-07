import { useLayoutEffect, useMemo, useRef, useState } from "react";

import type {
  AssignmentHelpChatMessage,
  AssignmentHelpMessageKey,
} from "../../../../types/assignmentHelp";

type UseAssignmentHelpAnimatedMessageIdsParams = {
  chatStageKey: string;
  messageIds: readonly AssignmentHelpMessageKey[];
  messages: AssignmentHelpChatMessage[];
};

// Marks only the newly introduced chat messages so existing bubbles do not re-animate on every stage swap.
export const useAssignmentHelpAnimatedMessageIds = ({
  chatStageKey,
  messageIds,
  messages,
}: UseAssignmentHelpAnimatedMessageIdsParams) => {
  const previousMessageIdsRef = useRef<readonly AssignmentHelpMessageKey[]>([]);
  const [animatedMessageIds, setAnimatedMessageIds] = useState<
    readonly AssignmentHelpMessageKey[]
  >([]);

  useLayoutEffect(() => {
    const previousMessageIds = previousMessageIdsRef.current;
    const nextAnimatedMessageIds = messageIds.filter((messageId) => {
      return !previousMessageIds.includes(messageId);
    });

    setAnimatedMessageIds(nextAnimatedMessageIds);
    previousMessageIdsRef.current = messageIds;
  }, [chatStageKey, messageIds]);

  return useMemo(() => {
    return new Set(
      messages
        .filter((_, index) => {
          const messageId = messageIds[index];
          return messageId ? animatedMessageIds.includes(messageId) : false;
        })
        .map((message) => {
          return message.id;
        }),
    );
  }, [animatedMessageIds, messageIds, messages]);
};
