import { useState } from "react";

import { Box, Flex, Text, VStack, useMediaQuery } from "@chakra-ui/react";

import { SparklesIcon } from "@/shared/_assets/icons";

import type { RoadmapStep } from "../../../types";
import { createFadeUpAnimation } from "../../../utils";

const stepRiseInAnimation = createFadeUpAnimation({
  distancePx: 20,
  durationMs: 360,
});

export const RoadmapStepCard = ({
  animationDelayMs,
  step,
}: {
  animationDelayMs: number;
  step: RoadmapStep;
}) => {
  const [reduceMotion] = useMediaQuery(["(prefers-reduced-motion: reduce)"]);
  const [isHovering, setIsHovering] = useState(false);
  const StepIcon = step.icon;

  return (
    <VStack
      align="stretch"
      animation={reduceMotion ? undefined : stepRiseInAnimation}
      animationDelay={`${animationDelayMs}ms`}
      cursor="pointer"
      flex="1 1 0"
      gap={0}
      minW={{ base: "280px", md: 0 }}
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      transition="transform 220ms ease"
      w="full"
      _hover={{
        transform: "translateY(-2px)",
      }}
    >
      <Flex justify="center" pb={6} w="full">
        <Box boxSize={28} position="relative">
          <Flex
            align="center"
            bg="white"
            border={`4px solid ${isHovering ? "seed.subtle" : "neutral.50"}`}
            borderRadius="full"
            boxShadow={
              isHovering
                ? "0px 20px 40px 0px rgba(0, 0, 0, 0.08)"
                : "0px 4px 24px 0px rgba(0, 0, 0, 0.04)"
            }
            boxSize="112px"
            justify="center"
            transition="border-color 220ms ease, box-shadow 220ms ease"
          >
            <Flex
              align="center"
              bg={isHovering ? "seed" : "seed.subtle"}
              borderRadius="full"
              boxSize={20}
              justify="center"
              position="relative"
              transition="background-color 220ms ease"
            >
              <Box
                borderRadius="full"
                boxShadow="0px 10px 15px -3px #BBF7D0, 0px 4px 6px -4px #BBF7D0"
                inset={0}
                opacity={isHovering ? 1 : 0}
                pointerEvents="none"
                position="absolute"
                transition="opacity 220ms ease"
              />
              <StepIcon boxSize="7" color={isHovering ? "white" : "seed"} />
            </Flex>
          </Flex>

          <Flex
            align="center"
            bg={isHovering ? "white" : "seed"}
            border={`2px solid ${isHovering ? "seed" : "white"}`}
            borderRadius="full"
            color={isHovering ? "seed" : "white"}
            fontSize="md"
            fontWeight="bold"
            boxSize={8}
            justify="center"
            position="absolute"
            right={-1}
            top={-1}
            transition="background-color 220ms ease, border-color 220ms ease, color 220ms ease"
          >
            {step.stepNumber}
          </Flex>
        </Box>
      </Flex>

      <VStack
        align="stretch"
        bg="white"
        border={`1px solid ${isHovering ? "seed" : "neutral.50"}`}
        borderRadius="4xl"
        boxShadow={
          isHovering
            ? "0px 20px 40px 0px rgba(0, 0, 0, 0.08)"
            : "0px 8px 30px 0px rgba(0, 0, 0, 0.06)"
        }
        gap={0}
        h="full"
        minH={50}
        overflow="hidden"
        position="relative"
        p={6}
        transition="border-color 220ms ease, box-shadow 220ms ease"
      >
        <Box
          bg={isHovering ? "seed" : "transparent"}
          h="6px"
          left={0}
          position="absolute"
          right={0}
          top={0}
          transition="background-color 220ms ease"
        />

        <VStack align="stretch" flex={1} gap={2.5}>
          <Text
            color="text"
            fontSize={{ base: "lg", lg: "xl" }}
            fontWeight="bold"
            lineHeight="1.4"
            textAlign="center"
          >
            {step.title}
          </Text>
          <Text
            color="text.secondary"
            fontSize="md"
            fontWeight="medium"
            lineHeight="1.625"
            textAlign="center"
          >
            {step.description}
          </Text>
        </VStack>

        <VStack
          align="center"
          borderTop={isHovering ? "none" : "1px solid"}
          borderColor="neutral.50"
          gap={0}
          mt={4}
          pt={4}
          transition="border-color 220ms ease"
          w="full"
        >
          <Flex
            align="center"
            bg={isHovering ? "seed.subtle" : "neutral.100"}
            borderRadius="lg"
            gap={1.5}
            px={3}
            py={1.5}
            transition="background-color 220ms ease"
          >
            <SparklesIcon
              boxSize={3}
              color={isHovering ? "seed" : "neutral.400"}
            />
            <Text
              color={isHovering ? "seed" : "text.secondary"}
              fontSize="xs"
              fontWeight="semibold"
              lineHeight="1.3"
              transition="color 220ms ease"
            >
              {step.tagLabel}
            </Text>
          </Flex>
        </VStack>
      </VStack>
    </VStack>
  );
};
