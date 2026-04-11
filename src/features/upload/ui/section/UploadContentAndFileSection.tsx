import type { ChangeEvent, DragEvent, RefObject } from "react";

import { Box, Flex, Text, Textarea, VStack } from "@chakra-ui/react";

import { UploadFileDropzone, UploadFileList } from "../../components";
import type { UploadedFile } from "../../hooks";

type Props = {
  content: string;
  maxContentLength: number;
  maxFiles: number;
  uploadedFiles: UploadedFile[];
  isDragging: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  addFileInputRef: RefObject<HTMLInputElement | null>;
  onContentChange: (value: string) => void;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
  onFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (id: string) => void;
};

export const UploadContentAndFileSection = ({
  content,
  maxContentLength,
  maxFiles,
  uploadedFiles,
  isDragging,
  fileInputRef,
  addFileInputRef,
  onContentChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInput,
  onRemoveFile,
}: Props) => {
  return (
    <VStack align="flex-start" gap={4} w="full">
      <Text
        color="neutral.600"
        fontSize="sm"
        fontWeight="semibold"
        textTransform="uppercase"
      >
        내용 작성 및 자료 업로드
      </Text>

      <Flex
        direction={{ base: "column", md: "row" }}
        border="1px solid"
        borderColor="neutral.50"
        borderRadius={{ base: "3xl", md: "4xl" }}
        boxShadow="0px 4px 20px 0px rgba(0,0,0,0.02)"
        overflow="hidden"
        w="full"
      >
        <Flex bg="white" direction="column" flex={1} p={{ base: 4, md: 8 }}>
          <Textarea
            border="none"
            color="neutral.900"
            flex={1}
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.6"
            maxLength={maxContentLength}
            minH={{ base: "320px", md: "256px" }}
            placeholder={
              "교수님이 제시한 과제 주제나 요구사항을 자유롭게 적어주세요.\n예: '마케팅 전략 분석 리포트 작성, 2000자 이내, SWOT 분석 포함 필수'"
            }
            resize="none"
            value={content}
            _focusVisible={{ outline: "none", boxShadow: "none" }}
            _placeholder={{
              color: "neutral.300",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              wordBreak: "keep-all",
            }}
            onChange={(e) => onContentChange(e.target.value)}
          />
          <Flex
            align="center"
            borderTop="1px solid"
            borderColor="neutral.50"
            justify="space-between"
            pt={{ base: 3, md: 4 }}
          >
            <Box bg="neutral.50" borderRadius="md" px={2} py={1}>
              <Text color="neutral.600" fontSize="xs" fontWeight="medium">
                텍스트 입력
              </Text>
            </Box>
            <Text color="neutral.600" fontSize="12px" fontWeight="medium">
              {content.length} / {maxContentLength.toLocaleString()}자
            </Text>
          </Flex>
        </Flex>

        <Flex
          bg="neutral.50"
          borderColor="neutral.50"
          borderLeftWidth={{ base: "0px", md: "1px" }}
          borderTopWidth={{ base: "1px", md: "0px" }}
          direction="column"
          flexShrink={0}
          justify="center"
          minH={{ base: "auto", md: "377px" }}
          p={{ base: 4, md: 8 }}
          w={{ base: "full", md: 80 }}
        >
          {uploadedFiles.length === 0 ? (
            <UploadFileDropzone
              fileInputRef={fileInputRef}
              isDragging={isDragging}
              maxFiles={maxFiles}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onFileInput={onFileInput}
            />
          ) : (
            <UploadFileList
              addFileInputRef={addFileInputRef}
              maxFiles={maxFiles}
              uploadedFiles={uploadedFiles}
              onFileInput={onFileInput}
              onRemoveFile={onRemoveFile}
            />
          )}
        </Flex>
      </Flex>
    </VStack>
  );
};
