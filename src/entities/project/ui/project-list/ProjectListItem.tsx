import { Box, Button, Flex, Progress, Text } from "@chakra-ui/react";

import { formatUpdatedAt } from "../../utils";

import { ProjectListItemMenu } from "./ProjectListItemMenu";

type Props = {
  name: string;
  updatedAt: string;
  currentStepOrder: number | null;
  totalStepCount: number;
  progressPercent: number;
  onClick?: () => void;
  onDelete?: () => void;
};

export const ProjectListItem = ({
  name,
  updatedAt,
  currentStepOrder,
  totalStepCount,
  progressPercent,
  onClick,
  onDelete,
}: Props) => {
  const currentStep = currentStepOrder ?? 0;
  const normalizedProgress = Math.min(Math.max(progressPercent, 0), 100);

  return (
    <Flex
      bg="container.bg"
      border="1px solid"
      borderColor="neutral.50"
      borderRadius="2xl"
      boxShadow="0px 8px 15px 0px rgba(0,0,0,0.04)"
      cursor={onClick ? "pointer" : "default"}
      direction="column"
      gap={3}
      p={{ base: 5, md: "25px" }}
      position="relative"
      transition="background 0.15s"
      w="full"
      _hover={{ bg: "neutral.50" }}
    >
      {onClick ? (
        <Button
          aria-label={`${name} 프로젝트 열기`}
          bg="transparent"
          borderRadius="2xl"
          cursor="pointer"
          h="auto"
          inset={0}
          minW={0}
          p={0}
          position="absolute"
          type="button"
          variant="plain"
          zIndex={1}
          _focusVisible={{
            outline: "2px solid",
            outlineColor: "seed",
            outlineOffset: "2px",
          }}
          onClick={onClick}
        />
      ) : null}

      <Flex align="flex-start" justify="space-between" minW={0} w="full">
        <Flex align="flex-start" direction="column" minW={0}>
          <Text
            color="text"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            w="full"
          >
            {name}
          </Text>
          <Text color="text.secondary" fontSize={{ base: "2xs", md: "xs" }}>
            {formatUpdatedAt(updatedAt)}
          </Text>
        </Flex>
        {onDelete ? (
          <Box position="relative" zIndex={2}>
            <ProjectListItemMenu onDelete={onDelete} />
          </Box>
        ) : null}
      </Flex>

      <Progress.Root max={100} min={0} value={normalizedProgress} w="full">
        <Flex align="center" justify="space-between" mb={2}>
          <Text color="text" fontSize="xs">
            Step {currentStep} of {totalStepCount}
          </Text>
          <Text color="seed" fontSize="xs">
            {normalizedProgress}%
          </Text>
        </Flex>
        <Progress.Track bg="neutral.100" borderRadius="full" h={1.5}>
          <Progress.Range bg="seed" borderRadius="full" />
        </Progress.Track>
      </Progress.Root>
    </Flex>
  );
};
