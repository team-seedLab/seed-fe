import { useEffect } from "react";

import { Popover, usePopoverContext } from "@chakra-ui/react";

import { ProjectStepResultToolbar } from "./ProjectStepResultToolbar";
import type { TextareaSelectionAnchor } from "./get-textarea-selection-anchor";

type Props = {
  anchor: TextareaSelectionAnchor;
  textareaId: string;
};

const ProjectStepResultFloatingToolbarContent = ({
  anchor,
  textareaId,
}: Props) => {
  const { reposition } = usePopoverContext();

  useEffect(() => {
    reposition();
  }, [anchor, reposition]);

  return (
    <Popover.Positioner zIndex="popover">
      <Popover.Content maxW="calc(100vw - 16px)" outline="none" w="fit-content">
        <ProjectStepResultToolbar textareaId={textareaId} />
      </Popover.Content>
    </Popover.Positioner>
  );
};

export const ProjectStepResultFloatingToolbar = ({
  anchor,
  textareaId,
}: Props) => {
  return (
    <Popover.Root
      autoFocus={false}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      modal={false}
      open
      portalled={false}
      positioning={{
        flip: true,
        getAnchorElement: () => anchor,
        gutter: 8,
        hideWhenDetached: true,
        overflowPadding: 8,
        placement: "top",
        slide: true,
        strategy: "fixed",
      }}
      unstyled
    >
      <ProjectStepResultFloatingToolbarContent
        anchor={anchor}
        textareaId={textareaId}
      />
    </Popover.Root>
  );
};
