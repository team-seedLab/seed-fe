import { Flex, Text, VStack } from "@chakra-ui/react";

import { FilePdfIcon, FilePenIcon, PictureIcon, XMarkIcon } from "@/shared";

import { formatSize, isImageUploadFile, isPdfUploadFile } from "../../../utils";

type Props = {
  file: File;
  onRemove: () => void;
};

const UploadFileIcon = ({ file }: { file: File }) => {
  if (isPdfUploadFile(file)) {
    return (
      <Flex
        align="center"
        bg="pdf.bg"
        borderRadius="lg"
        boxSize={9}
        flexShrink={0}
        justify="center"
      >
        <FilePdfIcon boxSize={4} color="pdf" />
      </Flex>
    );
  }

  if (isImageUploadFile(file)) {
    return (
      <Flex
        align="center"
        bg="green.50"
        borderRadius="lg"
        boxSize={9}
        flexShrink={0}
        justify="center"
      >
        <PictureIcon boxSize={4} color="green.500" />
      </Flex>
    );
  }

  return (
    <Flex
      align="center"
      bg="neutral.100"
      borderRadius="lg"
      boxSize={9}
      flexShrink={0}
      justify="center"
    >
      <FilePenIcon boxSize={4} color="neutral.500" />
    </Flex>
  );
};

export const UploadFileItem = ({ file, onRemove }: Props) => {
  return (
    <Flex
      align="center"
      bg="white"
      borderRadius="xl"
      boxShadow="0px 2px 8px 0px rgba(0,0,0,0.06)"
      gap={{ base: 2.5, md: 3 }}
      p={{ base: 2.5, md: 3 }}
    >
      <UploadFileIcon file={file} />
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
      <Flex
        align="center"
        cursor="pointer"
        flexShrink={0}
        h={6}
        justify="center"
        w={6}
        onClick={onRemove}
      >
        <XMarkIcon boxSize={3} color="neutral.600" />
      </Flex>
    </Flex>
  );
};
