import { useState } from "react";

import { Button, Flex, Text, VStack } from "@chakra-ui/react";

import type { SolutionAssignmentCard } from "../../../types";

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
    <Button
      aria-pressed={isActive}
      bg={isHighlighted ? "white" : "button.bg.secondary"}
      border="1px solid"
      borderColor={isHighlighted ? "button.border" : "transparent"}
      borderRadius="3xl"
      boxShadow={
        isHighlighted ? "0px 8px 30px 0px rgba(0, 0, 0, 0.06)" : "none"
      }
      cursor={isInteractive ? "pointer" : "default"}
      disabled={!isInteractive}
      flex="1 1 0"
      minW={{ base: "calc(50% - 10px)", lg: "0px" }}
      h={"fit-content"}
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
        outline: "2px solid",
        outlineColor: "seed",
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
          bg={isHighlighted ? "seed.subtle" : "white"}
          borderRadius="full"
          boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.05)"
          boxSize={12}
          justify="center"
          transition="background-color 200ms ease"
        >
          <CardIcon
            boxSize={5}
            color={isHighlighted ? "seed" : "neutral.400"}
          />
        </Flex>
        <VStack align="center" gap={1}>
          <Text
            color="text"
            fontSize="lg"
            fontWeight="bold"
            lineHeight="28px"
            whiteSpace="nowrap"
          >
            {card.title}
          </Text>
          <Text
            color="text.secondary"
            fontSize="xs"
            fontWeight="regular"
            lineHeight="16px"
            textAlign="center"
            whiteSpace="nowrap"
          >
            {card.description}
          </Text>
        </VStack>
      </VStack>
    </Button>
  );
};
