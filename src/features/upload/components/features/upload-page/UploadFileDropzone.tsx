import type { ChangeEvent, DragEvent, RefObject } from "react";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { FilePdfIcon } from "@/shared";

import { UPLOAD_FILE_ACCEPT, UPLOAD_FILE_TYPE_LABEL } from "../../../constants";

type Props = {
  isDragging: boolean;
  maxFiles: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
  onFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const UploadFileDropzone = ({
  isDragging,
  maxFiles,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInput,
}: Props) => {
  return (
    <>
      <input
        ref={fileInputRef}
        accept={UPLOAD_FILE_ACCEPT}
        multiple
        style={{ display: "none" }}
        type="file"
        onChange={onFileInput}
      />
      <Flex
        align="center"
        border="2px dashed"
        borderColor={isDragging ? "seed" : "neutral.300"}
        borderRadius="2xl"
        cursor="pointer"
        direction="column"
        flex={1}
        gap={{ base: 2.5, md: 3 }}
        justify="center"
        minH={{ base: "160px", md: "200px" }}
        p={{ base: 5, md: 6 }}
        transition="border-color 0.15s"
        onClick={() => fileInputRef.current?.click()}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Flex
          align="center"
          bg="white"
          borderRadius="full"
          boxSize={{ base: 10, md: 12 }}
          justify="center"
        >
          <Text color="neutral.600" fontSize={{ base: "xl", md: "2xl" }}>
            +
          </Text>
        </Flex>
        <VStack gap={1}>
          <Text
            color="neutral.900"
            fontSize="sm"
            fontWeight="bold"
            textAlign="center"
          >
            <Box as="span" display={{ base: "inline", md: "none" }}>
              파일을 선택해보세요
            </Box>
            <Box as="span" display={{ base: "none", md: "inline" }}>
              파일을 드래그해보세요
            </Box>
          </Text>
          <Text color="neutral.600" fontSize="xs" textAlign="center">
            <Box as="span" display={{ base: "inline", md: "none" }}>
              탭해서 업로드
            </Box>
            <Box as="span" display={{ base: "none", md: "inline" }}>
              또는 클릭해서 업로드
            </Box>
          </Text>
        </VStack>
        <Flex
          align="center"
          bg="white"
          borderRadius="full"
          gap={1}
          px={{ base: 2.5, md: 3 }}
          py={1}
        >
          <FilePdfIcon boxSize="10px" color="neutral.600" />
          <Text color="neutral.600" fontSize="10px">
            {UPLOAD_FILE_TYPE_LABEL} (최대 {maxFiles}개)
          </Text>
        </Flex>
      </Flex>
    </>
  );
};
