import { Button, Flex, Text, VStack } from "@chakra-ui/react";

import { type AssignmentType } from "@/entities";

import { UPLOAD_ASSIGNMENT_TYPES } from "../../constants";

type Props = {
  selectedType: AssignmentType;
  onSelectType: (type: AssignmentType) => void;
};

export const UploadAssignmentTypeSection = ({
  selectedType,
  onSelectType,
}: Props) => {
  return (
    <VStack align="flex-start" gap={4} w="full">
      <Text color="neutral.600" fontSize="sm" fontWeight="semibold">
        과제 유형
      </Text>
      <Flex gap={{ base: 2, md: 3 }} wrap="wrap" w="full">
        {UPLOAD_ASSIGNMENT_TYPES.map(({ label, Icon }) => {
          const isActive = selectedType === label;

          return (
            <Button
              aria-pressed={isActive}
              key={label}
              bg={isActive ? "seed.subtle" : "neutral.50"}
              border="2px solid"
              borderColor={isActive ? "seed" : "neutral.50"}
              borderRadius="3xl"
              cursor="pointer"
              gap={2}
              h={{ base: 12, md: 14 }}
              minW={{ base: "calc(50% - 4px)", md: "120px" }}
              px={{ base: 3, md: 5 }}
              transition="all 0.15s"
              type="button"
              variant="plain"
              _focusVisible={{
                outline: "2px solid",
                outlineColor: "seed",
                outlineOffset: "2px",
              }}
              onClick={() => onSelectType(label)}
            >
              <Icon boxSize="15px" color={isActive ? "seed" : "neutral.900"} />
              <Text
                color={isActive ? "seed.900" : "neutral.900"}
                fontSize="sm"
                fontWeight="semibold"
                whiteSpace="nowrap"
              >
                {label}
              </Text>
            </Button>
          );
        })}
      </Flex>
    </VStack>
  );
};
