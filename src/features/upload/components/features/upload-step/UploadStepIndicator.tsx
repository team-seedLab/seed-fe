import { Box, Flex, Text } from "@chakra-ui/react";

import { ROADMAP_STEP_NAMES } from "@/entities";

type Props = {
  current: number;
  stepCodes: string[];
};

export const UploadStepIndicator = ({ current, stepCodes }: Props) => {
  return (
    <Box overflowX={{ base: "auto", md: "visible" }} w="full">
      <Flex
        align="flex-start"
        justify={{ base: "flex-start", md: "space-between" }}
        maxW={{ base: "none", md: "672px" }}
        mx={{ base: 0, md: "auto" }}
        px={{ base: 4, md: 0 }}
        w={{ base: "max-content", md: "full" }}
      >
        {stepCodes.map((code, i) => {
          const stepId = i + 1;
          const isActive = stepId === current;
          const isDone = stepId < current;
          const isLast = i === stepCodes.length - 1;

          return (
            <Flex align="flex-start" flexShrink={0} key={code}>
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
                  {ROADMAP_STEP_NAMES[code] ?? code}
                </Text>
              </Flex>

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
