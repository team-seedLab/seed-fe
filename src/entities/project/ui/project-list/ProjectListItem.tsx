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
      p={{ base: 4, md: "25px" }}
      w="full"
      align="center"
      justify="space-between"
      cursor="pointer"
      _hover={{ bg: "neutral.50" }}
      transition="background 0.15s"
      onClick={onClick}
    >
      <Flex align="center" gap={{ base: 3, md: 5 }} minW={0}>
        <Flex
          bg={status === "COMPLETED" ? "seed.subtle" : "progress.subtle"}
          borderRadius="xl"
          boxSize={{ base: 10, md: 12 }}
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Icon
            color={status === "COMPLETED" ? "seed" : "progress"}
            w={{ base: 3.5, md: 4 }}
            h={{ base: 4.5, md: 5 }}
          />
        </Flex>
        <Flex align="flex-start" flexDir="column" minW={0}>
          <Text
            color="text"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            lineHeight="1.4"
            wordBreak="keep-all"
          >
            {name}
          </Text>
          <Text color="text.secondary" fontSize={{ base: "2xs", md: "xs" }}>
            {formatUpdatedAt(updatedAt)}
          </Text>
        </Flex>
      </Flex>
      <Flex align="center" gap={{ base: 2, md: 3 }}>
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
            <DeleteIcon color="neutral.400" boxSize={{ base: 3.5, md: 4 }} />
          </IconButton>
        )}
        <ChevronRightIcon
          color="neutral.600"
          w={{ base: "6px", md: "7px" }}
          h={{ base: "10px", md: "11px" }}
        />
      </Flex>
    </Flex>
  );
};
