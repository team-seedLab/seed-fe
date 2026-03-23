import { HStack } from "@chakra-ui/react";

import { AdjustmentsVerticalIcon } from "@/shared/_assets/icons";

import { ToolbarToggleButton } from "../../common";

type Props = {
  filterActive: boolean;
  setFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProjectListToolbar = ({
  filterActive,
  setFilterActive,
}: Props) => {
  return (
    <HStack gap={2}>
      <ToolbarToggleButton
        isActive={filterActive}
        onToggle={() => setFilterActive((v) => !v)}
        label="필터"
      >
        <AdjustmentsVerticalIcon boxSize="13.5px" />
      </ToolbarToggleButton>
    </HStack>
  );
};
