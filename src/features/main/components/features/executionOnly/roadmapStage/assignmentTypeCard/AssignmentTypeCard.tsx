import { useState } from "react";

import { Flex, Text, VStack, chakra } from "@chakra-ui/react";

import type { SolutionAssignmentCard } from "../../../../../types";

type AssignmentTypeCardProps = {
  card: SolutionAssignmentCard;
  isActive: boolean;
  isInteractive: boolean;
  onSelect: (cardId: SolutionAssignmentCard["id"]) => void;
};

export const AssignmentTypeCard = ({
  card,
  isActive,
  isInteractive,
  onSelect,
}: AssignmentTypeCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const isHighlighted = isActive || (isInteractive && isHovering);
  const CardIcon = card.icon;

  return (
    <chakra.button
      aria-pressed={isActive}
      bg={isHighlighted ? "white" : "#FAFAFA"}
      border="1px solid"
      borderColor={isHighlighted ? "#98C95C" : "transparent"}
      borderRadius="24px"
      boxShadow={
        isHighlighted ? "0px 8px 30px 0px rgba(0, 0, 0, 0.06)" : "none"
      }
      cursor={isInteractive ? "pointer" : "default"}
      disabled={!isInteractive}
      flex="1 1 0"
      minW={{ base: "calc(50% - 10px)", lg: "0px" }}
      onClick={() => {
        onSelect(card.id);
      }}
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      p={6}
      transition="background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
      type="button"
      _focusVisible={{
        outline: "2px solid #98C95C",
        outlineOffset: "2px",
      }}
      _hover={
        isInteractive
          ? {
              transform: "translateY(-2px)",
            }
          : undefined
      }
    >
      <VStack align="center" gap={3}>
        <Flex
          align="center"
          bg={isHighlighted ? "#F4FAEB" : "white"}
          borderRadius="full"
          boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.05)"
          h={12}
          justify="center"
          transition="background-color 200ms ease"
          w={12}
        >
          <CardIcon boxSize={5} color={isHighlighted ? "#98C95C" : "#191F28"} />
        </Flex>
        <VStack align="center" gap={1}>
          <Text
            color="#191F28"
            fontSize="18px"
            fontWeight={700}
            lineHeight="28px"
            whiteSpace="nowrap"
          >
            {card.title}
          </Text>
          <Text
            color="#A1A1A1"
            fontSize="12px"
            fontWeight={400}
            lineHeight="16px"
            textAlign="center"
            whiteSpace="nowrap"
          >
            {card.description}
          </Text>
        </VStack>
      </VStack>
    </chakra.button>
  );
};
