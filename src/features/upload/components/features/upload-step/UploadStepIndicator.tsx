import { Box, Flex, Text } from "@chakra-ui/react";

import { ROADMAP_STEP_NAMES } from "@/entities";

type Props = {
  current: number;
  stepCodes: string[];
};

export const UploadStepIndicator = ({ current, stepCodes }: Props) => {
  return (
    <Box position="relative" px="88px" w="full">
      <Flex
        align="center"
        justify="space-between"
        left="88px"
        maxW="672px"
        position="absolute"
        px={12}
        right="88px"
        top="22px"
      >
        {Array.from({ length: stepCodes.length - 1 }, (_, i) => (
          <Box key={i} bg="neutral.100" flex={1} h="2px" />
        ))}
      </Flex>

      <Flex align="flex-start" justify="space-between" maxW="672px" w="full">
        {stepCodes.map((code, i) => {
          const stepId = i + 1;
          const isActive = stepId === current;
          const isDone = stepId < current;

          return (
            <Flex align="center" direction="column" gap={3} key={code} w={24}>
              <Flex
                align="center"
                boxSize={12}
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
                  boxSize={7}
                  justify="center"
                  position="relative"
                  zIndex={1}
                >
                  <Text
                    color="white"
                    fontSize="xs"
                    fontWeight="bold"
                    lineHeight="16px"
                    textAlign="center"
                  >
                    {stepId}
                  </Text>
                </Flex>
              </Flex>

              <Text
                color={isActive ? "neutral.900" : "neutral.600"}
                fontSize="sm"
                fontWeight={isActive ? "bold" : "medium"}
                lineHeight="20px"
                textAlign="center"
                wordBreak="keep-all"
              >
                {ROADMAP_STEP_NAMES[code] ?? code}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
