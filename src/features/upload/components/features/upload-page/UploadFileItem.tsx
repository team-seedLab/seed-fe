import { Button, Flex, Text, VStack } from "@chakra-ui/react";

import { FilePdfIcon, XMarkIcon } from "@/shared";

import { formatSize } from "../../../utils";

type Props = {
  file: File;
  onRemove: () => void;
};

export const UploadFileItem = ({ file, onRemove }: Props) => {
  return (
    <Flex
      align="center"
      border="1px solid"
      borderColor="neutral.100"
      borderRadius="lg"
      gap={3}
      h={14}
      minW={0}
      px={3}
    >
      <Flex
        align="center"
        bg="pdf.bg"
        borderRadius="md"
        boxSize={8}
        flexShrink={0}
        justify="center"
      >
        <FilePdfIcon boxSize={4} color="pdf" />
      </Flex>
      <VStack align="flex-start" flex={1} gap={0} minW={0}>
        <Text
          color="neutral.900"
          fontSize="xs"
          fontWeight="semibold"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          w="full"
        >
          {file.name}
        </Text>
        <Text color="neutral.600" fontSize="2xs">
          {formatSize(file.size)}
        </Text>
      </VStack>
      <Button
        aria-label={`${file.name} 삭제`}
        boxSize={6}
        flexShrink={0}
        minW={6}
        p={0}
        type="button"
        variant="plain"
        onClick={onRemove}
      >
        <XMarkIcon boxSize={3} color="neutral.600" />
      </Button>
    </Flex>
  );
};
