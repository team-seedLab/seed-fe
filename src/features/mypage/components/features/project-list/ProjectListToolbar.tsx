import { HStack, Text } from "@chakra-ui/react";

import type { ProjectFilter } from "@/entities";

const FILTER_TABS = [
  { label: "전체", value: "ALL" },
  { label: "진행 중", value: "IN_PROGRESS" },
  { label: "완료", value: "COMPLETED" },
] as const satisfies readonly { label: string; value: ProjectFilter }[];

type Props = {
  activeFilter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
};

export const ProjectListToolbar = ({ activeFilter, onFilterChange }: Props) => {
  return (
    <HStack gap={6} borderBottom="1px solid" borderColor="transparent" pb="1px">
      {FILTER_TABS.map((tab) => {
        const isActive = activeFilter === tab.value;
        return (
          <Text
            key={tab.value}
            as="button"
            fontSize="sm"
            fontWeight="medium"
            color={isActive ? "seed" : "neutral.500"}
            borderBottom="2px solid"
            borderColor={isActive ? "seed" : "transparent"}
            pb="2px"
            cursor="pointer"
            onClick={() => onFilterChange(tab.value)}
          >
            {tab.label}
          </Text>
        );
      })}
    </HStack>
  );
};
