import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { formatUpdatedAt } from "@/entities";
import { ChevronRightIcon } from "@/shared";

import type { MentorMenteeProject } from "../types";

type Props = {
  project: MentorMenteeProject;
  onClick: () => void;
};

export const MentorMenteeProjectCard = ({ project, onClick }: Props) => {
  return (
    <Flex
      bg="container.bg"
      border="1px solid"
      borderColor="neutral.50"
      borderRadius="2xl"
      boxShadow="0px 8px 15px 0px rgba(0,0,0,0.04)"
      cursor="pointer"
      direction="column"
      gap={3}
      p={{ base: 5, md: "25px" }}
      transition="background 0.15s"
      w="full"
      _hover={{ bg: "neutral.50" }}
      onClick={onClick}
    >
      <Flex align="flex-start" gap={4} justify="space-between">
        <VStack align="flex-start" flex={1} gap={1} minW={0}>
          <Text
            color="text"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            lineHeight="1.4"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            w="full"
          >
            {project.title}
          </Text>
          <Text color="text.secondary" fontSize="xs" fontWeight="regular">
            {formatUpdatedAt(project.submittedAt)}
          </Text>
        </VStack>

        <Flex
          align="center"
          borderRadius="full"
          boxSize={8}
          color="neutral.400"
          flexShrink={0}
          justify="center"
        >
          <ChevronRightIcon boxSize={3} />
        </Flex>
      </Flex>

      <VStack align="stretch" gap={2} w="full">
        <Flex align="center" justify="space-between">
          <Text color="text" fontSize="xs" fontWeight="medium">
            Step {project.currentStep} of {project.totalSteps}
          </Text>
          <Text color="seed" fontSize="xs" fontWeight="semibold">
            {project.completionRate}%
          </Text>
        </Flex>

        <Box bg="neutral.100" borderRadius="full" h="6px" overflow="hidden">
          <Box
            bg="seed"
            borderRadius="full"
            h="full"
            w={`${project.completionRate}%`}
          />
        </Box>
      </VStack>
    </Flex>
  );
};
