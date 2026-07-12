import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { ROADMAP_STEP_NAMES } from "@/entities";

type Props = {
  activeStep: number;
  stepCodes: readonly string[];
  completedStepCodes?: readonly string[];
  onStepSelect?: (step: number) => void;
};

type StepContentProps = {
  isActive: boolean;
  isDone: boolean;
  stepId: number;
  stepName: string;
};

const StepContent = ({
  isActive,
  isDone,
  stepId,
  stepName,
}: StepContentProps) => (
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
        bg={isActive || isDone ? "seed" : "neutral.300"}
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
          {stepId}
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

export const UploadStepIndicator = ({
  activeStep,
  stepCodes,
  completedStepCodes = [],
  onStepSelect,
}: Props) => {
  return (
    <Box overflowX={{ base: "auto", md: "visible" }} w="full">
      <Flex
        align="flex-start"
        justify={{ base: "flex-start", md: "space-between" }}
        maxW={{ base: "none", md: "672px" }}
        mx={{ base: 0, md: "auto" }}
        px={{ base: 4, md: 0 }}
        role="list"
        w={{ base: "max-content", md: "full" }}
      >
        {stepCodes.map((code, i) => {
          const stepId = i + 1;
          const isActive = stepId === activeStep;
          const isDone = completedStepCodes.includes(code);
          const isLast = i === stepCodes.length - 1;
          const stepName = ROADMAP_STEP_NAMES[code] ?? code;

          return (
            <Flex align="flex-start" flexShrink={0} key={code} role="listitem">
              {onStepSelect ? (
                <Button
                  _hover={{ bg: "transparent" }}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={stepName}
                  bg="transparent"
                  borderRadius="none"
                  h="auto"
                  minW={0}
                  onClick={() => onStepSelect(stepId)}
                  p={0}
                  type="button"
                  variant="ghost"
                >
                  <StepContent
                    isActive={isActive}
                    isDone={isDone}
                    stepId={stepId}
                    stepName={stepName}
                  />
                </Button>
              ) : (
                <Flex aria-current={isActive ? "step" : undefined}>
                  <StepContent
                    isActive={isActive}
                    isDone={isDone}
                    stepId={stepId}
                    stepName={stepName}
                  />
                </Flex>
              )}

              {!isLast && (
                <Box
                  alignSelf="flex-start"
                  bg="neutral.100"
                  flexShrink={0}
                  h="2px"
                  mt={{ base: "19px", md: "23px" }}
                  w={{ base: "24px", md: "48px" }}
                />
              )}
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
