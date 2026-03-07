import { keyframes } from "@emotion/react";

const assignmentHelpStageFadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ASSIGNMENT_HELP_STAGE_SWAP_ANIMATION = `${assignmentHelpStageFadeUp} 240ms cubic-bezier(0.22, 1, 0.36, 1) both`;
