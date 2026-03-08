import { useEffect } from "react";

import { Box } from "@chakra-ui/react";

import { AssignmentHelpPromptScene, TimeLossScene } from "../components";
import { ASSIGNMENT_HELP_SECTION_SCROLL_VH } from "../constants";
import { useAssignmentHelpSectionState } from "../hooks";

type AssignmentHelpSectionProps = {
  onSolutionReadyChange?: (isReady: boolean) => void;
};

export const AssignmentHelpSection = ({
  onSolutionReadyChange,
}: AssignmentHelpSectionProps) => {
  const { assignmentHelpState, chatRef, introRef, timeLossSceneRef } =
    useAssignmentHelpSectionState();
  const isSolutionReady = assignmentHelpState.flags.isSolutionReady;

  useEffect(() => {
    onSolutionReadyChange?.(isSolutionReady);
  }, [isSolutionReady, onSolutionReadyChange]);

  return (
    <Box position="relative" w="full">
      <Box position="relative" w="full">
        <Box
          h="calc(100dvh - {sizes.headerHeight})"
          overflow="hidden"
          position="sticky"
          top={0}
        >
          <Box h="full" position="relative" w="full">
            <Box inset={0} position="absolute" w="full" zIndex={2}>
              <AssignmentHelpPromptScene
                chat={assignmentHelpState.chat}
                composer={assignmentHelpState.composer}
                isChatVisible={assignmentHelpState.flags.isChatVisible}
                title={assignmentHelpState.title}
              />
              <TimeLossScene timeLoss={assignmentHelpState.timeLoss} />
            </Box>
          </Box>
        </Box>

        <Box>
          <Box
            h={`${ASSIGNMENT_HELP_SECTION_SCROLL_VH.intro}vh`}
            ref={introRef}
          />
          <Box
            h={`${ASSIGNMENT_HELP_SECTION_SCROLL_VH.chat}vh`}
            ref={chatRef}
          />
          <Box
            h={`${ASSIGNMENT_HELP_SECTION_SCROLL_VH.timeLoss}vh`}
            ref={timeLossSceneRef}
          />
        </Box>
      </Box>
    </Box>
  );
};
