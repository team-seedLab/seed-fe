import type { ChangeEvent, DragEvent, RefObject } from "react";

import { Text, VStack } from "@chakra-ui/react";

import { UploadFileList } from "../../components";
import { MAX_UPLOAD_FILE_SIZE_IN_MB } from "../../constants";
import type { UploadedFile } from "../../hooks";

type Props = {
  maxFiles: number;
  uploadedFiles: UploadedFile[];
  isDragging: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
  onFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (id: string) => void;
};

export const UploadReferenceFileSection = ({
  maxFiles,
  uploadedFiles,
  isDragging,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInput,
  onRemoveFile,
}: Props) => {
  return (
    <VStack align="stretch" gap={3} w="full">
      <VStack align="flex-start" gap={1}>
        <Text color="neutral.900" fontSize="sm" fontWeight="semibold">
          참고자료
        </Text>
        <Text color="neutral.600" fontSize="xs">
          PDF 파일을 최대 {maxFiles}개까지 추가할 수 있습니다. 파일당 최대{" "}
          {MAX_UPLOAD_FILE_SIZE_IN_MB}MB
        </Text>
      </VStack>
      <UploadFileList
        fileInputRef={fileInputRef}
        isDragging={isDragging}
        maxFiles={maxFiles}
        uploadedFiles={uploadedFiles}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onFileInput={onFileInput}
        onRemoveFile={onRemoveFile}
      />
    </VStack>
  );
};
