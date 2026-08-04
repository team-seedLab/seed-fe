import type { ReactNode } from "react";

import { IconButton, Tooltip } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
  command: string;
  label: string;
};

export const ProjectStepResultToolbarButton = ({
  children,
  command,
  label,
}: Props) => {
  return (
    <Tooltip.Root closeDelay={0} openDelay={400}>
      <Tooltip.Trigger asChild>
        <IconButton
          aria-label={label}
          borderRadius="full"
          boxSize={8}
          color="neutral.600"
          data-md-button={command}
          flexShrink={0}
          minW={8}
          type="button"
          variant="ghost"
          _focusVisible={{
            outline: "2px solid",
            outlineColor: "seed",
            outlineOffset: "1px",
          }}
          _hover={{ bg: "neutral.100", color: "neutral.900" }}
        >
          {children}
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content
          bg="neutral.900"
          borderRadius="md"
          color="white"
          fontSize="xs"
          px={2}
          py={1}
        >
          {label}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
};
