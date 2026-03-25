import { Flex, IconButton, Text } from "@chakra-ui/react";

import { ChevronRightIcon, DeleteIcon } from "@/shared";

import { ROADMAP_TYPE_ICON } from "../../model/constants";
import type { ProjectStatus, RoadmapType } from "../../model/types";
import { formatUpdatedAt } from "../../utils";

type Props = {
  name: string;
  updatedAt: string;
  status: ProjectStatus;
  roadmapType: RoadmapType;
  onClick?: () => void;
  onDelete?: () => void;
};

export const ProjectListItem = ({
  name,
  updatedAt,
  status,
  roadmapType,
  onClick,
  onDelete,
}: Props) => {
  const Icon = ROADMAP_TYPE_ICON[roadmapType];

  return (
    <Flex
      bg="container.bg"
      border="1px solid"
      borderColor="container.border"
      borderRadius="2xl"
      boxShadow="0px 8px 30px 0px rgba(0,0,0,0.04)"
      p="25px"
      w="full"
      align="center"
      justify="space-between"
      cursor="pointer"
      _hover={{ bg: "neutral.50" }}
      transition="background 0.15s"
      onClick={onClick}
    >
      <Flex gap={5} align="center">
        <Flex
          bg={status === "COMPLETED" ? "seed.subtle" : "progress.subtle"}
          borderRadius="xl"
          boxSize={12}
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Icon
            color={status === "COMPLETED" ? "seed" : "progress"}
            w={4}
            h={5}
          />
        </Flex>
        <Flex flexDir="column" align="flex-start">
          <Text color="text" fontSize="lg" fontWeight="bold">
            {name}
          </Text>
          <Text color="text.secondary" fontSize="xs">
            {formatUpdatedAt(updatedAt)}
          </Text>
        </Flex>
      </Flex>
      <Flex gap={3} align="center">
        {onDelete && (
          <IconButton
            aria-label="프로젝트 삭제"
            variant="ghost"
            size="sm"
            borderRadius="md"
            _hover={{ bg: "neutral.100" }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <DeleteIcon color="neutral.400" boxSize={4} />
          </IconButton>
        )}
        <ChevronRightIcon color="neutral.600" w="7px" h="11px" />
      </Flex>
    </Flex>
  );
};
