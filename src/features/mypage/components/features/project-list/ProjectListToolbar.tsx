import { HStack } from "@chakra-ui/react";

import { AdjustmentsVerticalIcon, SettingIcon } from "@/shared/_assets/icons";

import { ToolbarToggleButton } from "../../common";

type Props = {
  filterActive: boolean;
  setFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
  manageActive: boolean;
  setManageActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProjectListToolbar = ({
  filterActive,
  setFilterActive,
  manageActive,
  setManageActive,
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
      <ToolbarToggleButton
        isActive={manageActive}
        onToggle={() => setManageActive((v) => !v)}
        label="관리"
      >
        <SettingIcon boxSize="15px" />
      </ToolbarToggleButton>
    </HStack>
  );
};
