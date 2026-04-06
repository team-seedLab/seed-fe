import { Flex, HStack, Text, VStack } from "@chakra-ui/react";

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
      <HStack flexWrap="wrap" gap={3}>
        {UPLOAD_ASSIGNMENT_TYPES.map(({ label, Icon }) => {
          const isActive = selectedType === label;

          return (
            <Flex
              key={label}
              align="center"
              bg={isActive ? "seed.subtle" : "neutral.50"}
              border="2px solid"
              borderColor={isActive ? "seed" : "neutral.50"}
              borderRadius="3xl"
              cursor="pointer"
              gap={2}
              h={14}
              justify="center"
              minW="120px"
              px={5}
              transition="all 0.15s"
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
            </Flex>
          );
        })}
      </HStack>
    </VStack>
  );
};
