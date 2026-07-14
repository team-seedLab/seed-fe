import { useState } from "react";

import {
  type ProjectStepAiMessageType,
  useCreateProjectStepAiMessage,
  useGetProjectStepAiMessages,
} from "@/entities";

import { AI_MENTOR_REASK_MESSAGE } from "../constants";

type Params = {
  editedPrompt: string;
  ensurePromptSaved: (content: string) => Promise<boolean>;
  isOpen: boolean;
  originalPrompt: string;
  projectId: string;
  stepCode?: string;
};

type PendingRequest = {
  content: string;
};

export const useUploadAiMentorConversation = ({
  editedPrompt,
  ensurePromptSaved,
  isOpen,
  originalPrompt,
  projectId,
  stepCode,
}: Params) => {
  const [draftsByStep, setDraftsByStep] = useState<Record<string, string>>({});
  const [pendingRequestsByStep, setPendingRequestsByStep] = useState<
    Record<string, PendingRequest | undefined>
  >({});
  const normalizedStepCode = stepCode ?? "";
  const conversationKey = `${projectId}:${normalizedStepCode}`;
  const messagesQuery = useGetProjectStepAiMessages(
    projectId,
    normalizedStepCode,
    isOpen,
  );
  const createMessageMutation = useCreateProjectStepAiMessage();
  const draft = draftsByStep[conversationKey] ?? "";
  const pendingRequest = pendingRequestsByStep[conversationKey];
  const pendingContent = pendingRequest?.content ?? null;
  const hasPromptChanges =
    editedPrompt.trim().length > 0 &&
    editedPrompt.trim() !== originalPrompt.trim();

  const changeDraft = (content: string) => {
    setDraftsByStep((previousDrafts) => ({
      ...previousDrafts,
      [conversationKey]: content,
    }));
  };

  const setPendingRequest = (request: PendingRequest) => {
    setPendingRequestsByStep((previousRequests) => ({
      ...previousRequests,
      [conversationKey]: request,
    }));
  };

  const clearPendingRequest = (request: PendingRequest) => {
    setPendingRequestsByStep((previousRequests) => {
      if (previousRequests[conversationKey] !== request) {
        return previousRequests;
      }

      const nextRequests = { ...previousRequests };
      delete nextRequests[conversationKey];
      return nextRequests;
    });
  };

  const createMessage = async (
    messageType: ProjectStepAiMessageType,
    content: string,
    restoreDraftOnError: boolean,
  ) => {
    if (!projectId || !stepCode || pendingRequest) {
      return;
    }

    const request = { content };
    setPendingRequest(request);

    try {
      await createMessageMutation.mutateAsync({
        projectId,
        stepCode,
        messageType,
        content,
      });
    } catch {
      if (restoreDraftOnError) {
        setDraftsByStep((previousDrafts) => ({
          ...previousDrafts,
          [conversationKey]: previousDrafts[conversationKey] || content,
        }));
      }
    } finally {
      clearPendingRequest(request);
    }
  };

  const sendQuestion = async () => {
    const question = draft.trim();

    if (!question) {
      return;
    }

    changeDraft("");
    await createMessage("CHAT", question, true);
  };

  const reaskWithEditedPrompt = async () => {
    if (!hasPromptChanges || pendingRequest || !stepCode) {
      return;
    }

    const request = {
      content: AI_MENTOR_REASK_MESSAGE,
    };
    setPendingRequest(request);

    const isPromptSaved = await ensurePromptSaved(editedPrompt);

    if (!isPromptSaved) {
      clearPendingRequest(request);
      return;
    }

    try {
      await createMessageMutation.mutateAsync({
        projectId,
        stepCode,
        messageType: "REASK_WITH_EDITED_PROMPT",
        content: AI_MENTOR_REASK_MESSAGE,
      });
    } catch {
      return;
    } finally {
      clearPendingRequest(request);
    }
  };

  return {
    changeDraft,
    draft,
    hasPromptChanges,
    isError: messagesQuery.isError,
    isLoading: messagesQuery.isLoading,
    isSending: pendingContent !== null,
    messages: messagesQuery.data ?? [],
    pendingContent,
    reaskWithEditedPrompt,
    retryMessages: messagesQuery.refetch,
    sendQuestion,
  };
};
