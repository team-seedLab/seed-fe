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
    <VStack align="stretch" gap={3} w="full">
      <Text color="neutral.900" fontSize="sm" fontWeight="semibold">
        과제 유형
      </Text>
      <Flex gap={2} wrap="wrap">
        {UPLOAD_ASSIGNMENT_TYPES.map((type) => {
          const isActive = selectedType === type;

          return (
            <Button
              aria-pressed={isActive}
              key={type}
              bg={isActive ? "seed.subtle" : "neutral.50"}
              border="1px solid"
              borderColor={isActive ? "seed" : "neutral.100"}
              borderRadius="full"
              color={isActive ? "seed" : "neutral.600"}
              fontSize="xs"
              fontWeight="semibold"
              h={8}
              px={4}
              type="button"
              variant="plain"
              _hover={{ borderColor: "seed", color: "seed" }}
              onClick={() => onSelectType(type)}
            >
              {type}
            </Button>
          );
        })}
      </Flex>
    </VStack>
  );
};
