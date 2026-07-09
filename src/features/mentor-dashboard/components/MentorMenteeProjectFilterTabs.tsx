import { HStack, Text } from "@chakra-ui/react";

import type { ProjectStatus } from "@/entities";

const FILTER_TABS: { label: string; value: ProjectStatus | undefined }[] = [
  { label: "전체", value: undefined },
  { label: "진행 중", value: "IN_PROGRESS" },
  { label: "완료", value: "COMPLETED" },
];

type Props = {
  activeFilter: ProjectStatus | undefined;
  onFilterChange: (filter: ProjectStatus | undefined) => void;
};

export const MentorMenteeProjectFilterTabs = ({
  activeFilter,
  onFilterChange,
}: Props) => {
  return (
    <HStack borderBottom="1px solid" borderColor="transparent" gap={6} pb="1px">
      {FILTER_TABS.map((tab) => {
        const isActive = activeFilter === tab.value;

        return (
          <Text
            key={tab.label}
            as="button"
            borderBottom="2px solid"
            borderColor={isActive ? "seed" : "transparent"}
            color={isActive ? "seed" : "neutral.500"}
            cursor="pointer"
            fontSize="sm"
            fontWeight="medium"
            pb="2px"
            onClick={() => onFilterChange(tab.value)}
          >
            {tab.label}
          </Text>
        );
      })}
    </HStack>
  );
};
