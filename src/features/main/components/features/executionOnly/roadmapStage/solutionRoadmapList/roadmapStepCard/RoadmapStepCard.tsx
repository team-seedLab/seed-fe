import { useState } from "react";

import { Box, Flex, Text, VStack, useMediaQuery } from "@chakra-ui/react";

import { SparklesIcon } from "@/shared/_assets/icons";

import type { RoadmapStep } from "../../../../../../types";
import { createFadeUpAnimation } from "../../../../../../utils";

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
      minW={{ base: "280px", md: "0px" }}
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
        <Box h="112px" position="relative" w="112px">
          <Flex
            align="center"
            bg="white"
            border={`4px solid ${isHovering ? "#F4FAEB" : "#FAFAFA"}`}
            borderRadius="full"
            boxShadow={
              isHovering
                ? "0px 20px 40px 0px rgba(0, 0, 0, 0.08)"
                : "0px 4px 24px 0px rgba(0, 0, 0, 0.04)"
            }
            h="112px"
            justify="center"
            transition="border-color 220ms ease, box-shadow 220ms ease"
            w="112px"
          >
            <Flex
              align="center"
              bg={isHovering ? "#98C95C" : "#E7F3D4"}
              borderRadius="full"
              h="80px"
              justify="center"
              position="relative"
              transition="background-color 220ms ease"
              w="80px"
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
              <StepIcon boxSize="7" color={isHovering ? "white" : "#75AC36"} />
            </Flex>
          </Flex>

          <Flex
            align="center"
            bg={isHovering ? "white" : "#98C95C"}
            border={`2px solid ${isHovering ? "#98C95C" : "white"}`}
            borderRadius="full"
            color={isHovering ? "#98C95C" : "white"}
            fontSize="14px"
            fontWeight={700}
            h="32px"
            justify="center"
            position="absolute"
            right={-1}
            top={-1}
            transition="background-color 220ms ease, border-color 220ms ease, color 220ms ease"
            w="32px"
          >
            {step.stepNumber}
          </Flex>
        </Box>
      </Flex>

      <VStack
        align="stretch"
        bg="white"
        border={`1px solid ${isHovering ? "#98C95C" : "#FAFAFA"}`}
        borderRadius="32px"
        boxShadow={
          isHovering
            ? "0px 20px 40px 0px rgba(0, 0, 0, 0.08)"
            : "0px 8px 30px 0px rgba(0, 0, 0, 0.06)"
        }
        gap={0}
        h="full"
        minH="200px"
        overflow="hidden"
        position="relative"
        px={6}
        py={6}
        transition="border-color 220ms ease, box-shadow 220ms ease"
      >
        <Box
          bg={isHovering ? "#98C95C" : "transparent"}
          h="6px"
          left={0}
          position="absolute"
          right={0}
          top={0}
          transition="background-color 220ms ease"
        />

        <VStack align="stretch" flex={1} gap={2.5}>
          <Text
            color="#191F28"
            fontSize={{ base: "18px", lg: "20px" }}
            fontWeight={700}
            lineHeight="1.4"
            textAlign="center"
          >
            {step.title}
          </Text>
          <Text
            color="#A1A1A1"
            fontSize="14px"
            fontWeight={400}
            lineHeight="1.625"
            textAlign="center"
          >
            {step.description}
          </Text>
        </VStack>

        <VStack
          align="center"
          borderTop={isHovering ? "none" : "1px solid #FAFAFA"}
          gap={0}
          mt={4}
          pt={4}
          transition="border-color 220ms ease"
          w="full"
        >
          <Flex
            align="center"
            bg={isHovering ? "#F4FAEB" : "#FAFAFA"}
            borderRadius="8px"
            gap={1.5}
            px={3}
            py={1.5}
            transition="background-color 220ms ease"
          >
            <SparklesIcon
              boxSize="3"
              color={isHovering ? "#98C95C" : "#A1A1A1"}
            />
            <Text
              color={isHovering ? "#98C95C" : "#A1A1A1"}
              fontSize="12px"
              fontWeight={600}
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
