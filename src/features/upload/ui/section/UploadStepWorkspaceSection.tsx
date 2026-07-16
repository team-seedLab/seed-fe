import { useRef, useState } from "react";

import { Flex } from "@chakra-ui/react";

import {
  UploadAiMentorPanel,
  UploadAiMentorResponsivePanel,
} from "../../components";
import { AI_MENTOR_PANEL_LAYOUT } from "../../constants";
import {
  useUploadAiMentorConversation,
  useUploadAiMentorPanel,
  useUploadAiMentorResize,
  useUploadPromptEditor,
  useUploadStepData,
  useUploadStepProject,
  useUploadStepResultEditor,
} from "../../hooks";

import { UploadStepContentSection } from "./UploadStepContentSection";
import { UploadStepHeaderSection } from "./UploadStepHeaderSection";

type Props = {
  projectId: string;
  stepNum: number;
};

type PromptEditorFocusRequest = {
  editorKey: string;
  requestId: number | null;
};

export const UploadStepWorkspaceSection = ({ projectId, stepNum }: Props) => {
  const workspaceLayoutRef = useRef<HTMLDivElement>(null);
  const {
    isLastStep,
    isLoading: isProjectLoading,
    stepCode,
  } = useUploadStepProject({
    projectId,
    stepNum,
  });
  const editorKey = `${projectId}:${stepNum}`;
  const [promptEditorFocusRequest, setPromptEditorFocusRequest] =
    useState<PromptEditorFocusRequest>({
      editorKey,
      requestId: null,
    });
  const {
    isStepLoading,
    promptData,
    resultData,
    savePrompt,
    savePromptOnPageExit,
    saveResult,
    saveResultOnPageExit,
  } = useUploadStepData({ projectId, stepCode });
  const isWorkspaceLoading = isProjectLoading || isStepLoading;
  const originalPrompt = promptData?.providedPromptSnapshot ?? "";
  const promptEditor = useUploadPromptEditor({
    editorKey,
    initialEditedPrompt: promptData?.editedPrompt,
    onSave: savePrompt,
    onSaveBeforePageExit: savePromptOnPageExit,
    originalPrompt,
  });
  const resultEditor = useUploadStepResultEditor({
    editorKey,
    initialResult: resultData?.contentMarkdown,
    isReady: Boolean(stepCode) && !isWorkspaceLoading,
    onSave: saveResult,
    onSaveBeforePageExit: saveResultOnPageExit,
  });
  const { closePanel, isOpen, isSplitScreen, openPanel } =
    useUploadAiMentorPanel();
  const panelResize = useUploadAiMentorResize({
    containerRef: workspaceLayoutRef,
    enabled: isSplitScreen,
  });
  const conversation = useUploadAiMentorConversation({
    editedPrompt: promptEditor.editedPrompt,
    ensurePromptSaved: promptEditor.ensurePromptSaved,
    isOpen,
    originalPrompt,
    projectId,
    stepCode,
  });

  if (promptEditorFocusRequest.editorKey !== editorKey) {
    setPromptEditorFocusRequest({ editorKey, requestId: null });
  }

  const handleEditPrompt = () => {
    if (!isSplitScreen) {
      closePanel();
    }

    setPromptEditorFocusRequest((currentRequest) => ({
      editorKey,
      requestId:
        currentRequest.editorKey === editorKey &&
        currentRequest.requestId !== null
          ? currentRequest.requestId + 1
          : 1,
    }));
  };

  return (
    <Flex
      minH="calc(100dvh - 60px)"
      px={{ base: 4, md: 6, xl: 12 }}
      py={{ base: 4, md: 5 }}
      w="full"
    >
      <Flex
        align="flex-start"
        maxW="1824px"
        mx="auto"
        ref={workspaceLayoutRef}
        w="full"
      >
        <Flex
          direction="column"
          display={!isSplitScreen && isOpen ? "none" : "flex"}
          flex={1}
          minW={
            isSplitScreen && isOpen
              ? `${AI_MENTOR_PANEL_LAYOUT.MIN_MAIN_WIDTH}px`
              : 0
          }
          py={{ base: 6, md: 10 }}
        >
          <Flex
            direction="column"
            gap={{ base: 6, md: 10 }}
            maxW="934px"
            mx="auto"
            w="full"
          >
            <UploadStepHeaderSection projectId={projectId} stepNum={stepNum} />

            <UploadStepContentSection
              editorFocusRequestId={
                promptEditorFocusRequest.editorKey === editorKey
                  ? promptEditorFocusRequest.requestId
                  : null
              }
              isLastStep={isLastStep}
              isStepLoading={isWorkspaceLoading}
              promptData={promptData}
              promptEditor={promptEditor}
              projectId={projectId}
              resultEditor={resultEditor}
              stepCode={stepCode}
              stepNum={stepNum}
            />
          </Flex>
        </Flex>

        <UploadAiMentorResponsivePanel
          isOpen={isOpen}
          isResizing={panelResize.isResizing}
          isSplitScreen={isSplitScreen}
          maxPanelWidth={panelResize.maxPanelWidth}
          minPanelWidth={panelResize.minPanelWidth}
          panelWidth={panelResize.panelWidth}
          onOpen={openPanel}
          onResizeKeyDown={panelResize.handleResizeKeyDown}
          onResizePointerCancel={panelResize.handleResizePointerCancel}
          onResizePointerDown={panelResize.handleResizePointerDown}
          onResizePointerMove={panelResize.handleResizePointerMove}
          onResizePointerUp={panelResize.handleResizePointerUp}
        >
          <UploadAiMentorPanel
            draft={conversation.draft}
            hasPromptChanges={conversation.hasPromptChanges}
            isError={conversation.isError}
            isLoading={conversation.isLoading}
            isSending={conversation.isSending}
            messages={conversation.messages}
            pendingContent={conversation.pendingContent}
            onChangeDraft={conversation.changeDraft}
            onClose={closePanel}
            onEditPrompt={handleEditPrompt}
            onReask={() => {
              void conversation.reaskWithEditedPrompt();
            }}
            onRetry={() => {
              void conversation.retryMessages();
            }}
            onSend={() => {
              void conversation.sendQuestion();
            }}
          />
        </UploadAiMentorResponsivePanel>
      </Flex>
    </Flex>
  );
};
