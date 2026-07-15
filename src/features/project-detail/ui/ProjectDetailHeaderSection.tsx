import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { type Project, ROADMAP_TYPE_LABEL } from "@/entities";
import { CheckCircleIcon } from "@/shared";

import { formatProjectDetailPeriod } from "../utils";

type Props = {
  project: Project & {
    completedAt: string | null;
  };
};

export const ProjectDetailHeaderSection = ({ project }: Props) => {
  const isCompleted = project.status === "COMPLETED";

  return (
    <VStack
      align="flex-start"
      borderBottom="1px solid"
      borderColor="neutral.100"
      gap={{ base: 3, md: 4 }}
      pb={{ base: 5, md: 6 }}
      w="full"
    >
      <Box
        bg="neutral.50"
        border="1px solid"
        borderColor="white"
        borderRadius="md"
        color="neutral.600"
        fontSize="2xs"
        px={2}
        py={1}
      >
        {ROADMAP_TYPE_LABEL[project.roadmapType] ?? project.roadmapType}
      </Box>

      <Text
        as="h1"
        color="neutral.900"
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        wordBreak="keep-all"
      >
        {project.title}
      </Text>

      <Flex
        align="center"
        color="neutral.700"
        flexWrap="wrap"
        fontSize={{ base: "xs", md: "sm" }}
        gap={{ base: 2, md: 3 }}
      >
        <Text>
          {formatProjectDetailPeriod(project.createdAt, project.completedAt)}
        </Text>
        <Flex align="center" gap={1.5}>
          {isCompleted ? (
            <CheckCircleIcon boxSize={3.5} color="seed" />
          ) : (
            <Box bg="seed" borderRadius="full" boxSize={2} />
          )}
          <Text>{isCompleted ? "완료됨" : "진행 중"}</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};
