import { Box, Button, Flex, Text } from "@chakra-ui/react";

type Props = {
  isActive: boolean;
  isCompleted: boolean;
  step: number;
  stepName: string;
  onSelect?: () => void;
};

const ProjectStepIndicatorItemContent = ({
  isActive,
  isCompleted,
  step,
  stepName,
}: Omit<Props, "onSelect">) => (
  <Flex
    align="center"
    direction="column"
    gap={{ base: 2, md: 3 }}
    px={{ base: 2, md: 0 }}
    w={{ base: "88px", md: "96px" }}
  >
    <Flex
      align="center"
      boxSize={{ base: 10, md: 12 }}
      justify="center"
      position="relative"
    >
      <Box
        bg={isActive ? "seed" : "neutral.100"}
        borderRadius="full"
        bottom={0}
        left={0}
        opacity={isActive ? 0.3 : 0.6}
        position="absolute"
        right={0}
        top={0}
      />
      <Flex
        align="center"
        bg={isActive || isCompleted ? "seed" : "neutral.300"}
        borderRadius="full"
        boxSize={{ base: 6, md: 7 }}
        justify="center"
        position="relative"
        zIndex={1}
      >
        <Text
          color="white"
          fontSize={{ base: "2xs", md: "xs" }}
          fontWeight="bold"
          lineHeight="1"
          textAlign="center"
        >
          {step}
        </Text>
      </Flex>
    </Flex>

    <Text
      color={isActive ? "neutral.900" : "neutral.600"}
      fontSize={{ base: "xs", md: "sm" }}
      fontWeight={isActive ? "bold" : "medium"}
      lineHeight={{ base: "1.4", md: "20px" }}
      textAlign="center"
      whiteSpace="normal"
      wordBreak="keep-all"
    >
      {stepName}
    </Text>
  </Flex>
);

export const ProjectStepIndicatorItem = ({
  isActive,
  isCompleted,
  step,
  stepName,
  onSelect,
}: Props) => {
  const content = (
    <ProjectStepIndicatorItemContent
      isActive={isActive}
      isCompleted={isCompleted}
      step={step}
      stepName={stepName}
    />
  );

  if (!onSelect) {
    return <Flex aria-current={isActive ? "step" : undefined}>{content}</Flex>;
  }

  return (
    <Button
      _hover={{ bg: "transparent" }}
      aria-current={isActive ? "step" : undefined}
      aria-label={stepName}
      bg="transparent"
      borderRadius="none"
      cursor="pointer"
      h="auto"
      minW={0}
      onClick={onSelect}
      p={0}
      type="button"
      variant="ghost"
    >
      {content}
    </Button>
  );
};
