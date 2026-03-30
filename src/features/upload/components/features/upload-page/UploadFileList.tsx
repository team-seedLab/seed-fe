import type { ChangeEvent, RefObject } from "react";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { PlusCircleIcon } from "@/shared";

import { UPLOAD_FILE_ACCEPT } from "../../../constants";
import type { UploadedFile } from "../../../hooks";

import { UploadFileItem } from "./UploadFileItem";

type Props = {
  maxFiles: number;
  uploadedFiles: UploadedFile[];
  addFileInputRef: RefObject<HTMLInputElement | null>;
  onFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (id: string) => void;
};

export const UploadFileList = ({
  maxFiles,
  uploadedFiles,
  addFileInputRef,
  onFileInput,
  onRemoveFile,
}: Props) => {
  return (
    <VStack align="stretch" flex={1} gap={3} justify="space-between">
      <VStack align="stretch" gap={2}>
        {uploadedFiles.map(({ id, file }) => (
          <UploadFileItem
            key={id}
            file={file}
            onRemove={() => onRemoveFile(id)}
          />
        ))}

        {uploadedFiles.length < maxFiles && (
          <>
            <input
              ref={addFileInputRef}
              accept={UPLOAD_FILE_ACCEPT}
              multiple
              style={{ display: "none" }}
              type="file"
              onChange={onFileInput}
            />
            <Flex
              align="center"
              color="neutral.600"
              cursor="pointer"
              gap={2}
              justify="center"
              py={2}
              transition="color 0.15s"
              _hover={{ color: "seed" }}
              onClick={() => addFileInputRef.current?.click()}
            >
              <PlusCircleIcon boxSize={4} />
              <Text fontSize="xs" fontWeight="medium">
                파일 추가하기
              </Text>
            </Flex>
          </>
        )}
      </VStack>

      <VStack align="stretch" gap={1}>
        <Box bg="neutral.300" borderRadius="full" h={1.5} overflow="hidden">
          <Box
            bg="seed"
            borderRadius="full"
            h="full"
            transition="width 0.3s"
            w={`${(uploadedFiles.length / maxFiles) * 100}%`}
          />
        </Box>
        <Text
          color="neutral.600"
          fontSize="xs"
          fontWeight="medium"
          textAlign="right"
        >
          {uploadedFiles.length} / {maxFiles}개 업로드됨
        </Text>
      </VStack>
    </VStack>
  );
};
