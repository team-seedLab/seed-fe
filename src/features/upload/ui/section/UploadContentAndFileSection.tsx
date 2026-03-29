import type { ChangeEvent, DragEvent, RefObject } from "react";

import { Box, Flex, Text, Textarea, VStack } from "@chakra-ui/react";

import {
  FilePdfIcon,
  FilePenIcon,
  PictureIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@/shared";

import type { UploadedFile } from "../../hooks";
import { formatSize } from "../../utils";

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

const isPdf = (file: File) => file.type === "application/pdf";
const isImage = (file: File) => file.type.startsWith("image/");

const UploadFileIcon = ({ file }: { file: File }) => {
  if (isPdf(file)) {
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

  if (isImage(file)) {
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
        border="1px solid"
        borderColor="neutral.50"
        borderRadius="4xl"
        boxShadow="0px 4px 20px 0px rgba(0,0,0,0.02)"
        overflow="hidden"
        w="full"
      >
        <Flex bg="white" direction="column" flex={1} p={8}>
          <Textarea
            border="none"
            color="neutral.900"
            flex={1}
            h={64}
            maxLength={maxContentLength}
            placeholder={
              "교수님이 제시한 과제 주제나 요구사항을 자유롭게 적어주세요.\n예: '마케팅 전략 분석 리포트 작성, 2000자 이내, SWOT 분석 포함 필수'"
            }
            resize="none"
            value={content}
            _focusVisible={{ outline: "none", boxShadow: "none" }}
            _placeholder={{ color: "neutral.300" }}
            onChange={(e) => onContentChange(e.target.value)}
          />
          <Flex
            align="center"
            borderTop="1px solid"
            borderColor="neutral.50"
            justify="space-between"
            pt={4}
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
          borderLeft="1px solid"
          direction="column"
          flexShrink={0}
          justify="center"
          minH="377px"
          p={8}
          w={80}
        >
          {uploadedFiles.length === 0 ? (
            <>
              <input
                ref={fileInputRef}
                accept=".pdf,image/*"
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
                gap={3}
                justify="center"
                minH="200px"
                p={6}
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
                  boxSize={12}
                  justify="center"
                >
                  <Text color="neutral.600" fontSize="2xl">
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
                    파일을 드래그해보세요
                  </Text>
                  <Text color="neutral.600" fontSize="xs" textAlign="center">
                    또는 클릭하여 업로드
                  </Text>
                </VStack>
                <Flex
                  align="center"
                  bg="white"
                  borderRadius="full"
                  gap={1}
                  px={3}
                  py={1}
                >
                  <FilePdfIcon boxSize="10px" color="neutral.600" />
                  <Text color="neutral.600" fontSize="10px">
                    PDF (최대 {maxFiles}개)
                  </Text>
                </Flex>
              </Flex>
            </>
          ) : (
            <VStack align="stretch" flex={1} gap={3} justify="space-between">
              <VStack align="stretch" gap={2}>
                {uploadedFiles.map(({ id, file }) => (
                  <Flex
                    key={id}
                    align="center"
                    bg="white"
                    borderRadius="xl"
                    boxShadow="0px 2px 8px 0px rgba(0,0,0,0.06)"
                    gap={3}
                    p={3}
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
                      onClick={() => onRemoveFile(id)}
                    >
                      <XMarkIcon boxSize={3} color="neutral.600" />
                    </Flex>
                  </Flex>
                ))}

                {uploadedFiles.length < maxFiles && (
                  <>
                    <input
                      ref={addFileInputRef}
                      accept=".pdf,image/*"
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
                <Box
                  bg="neutral.300"
                  borderRadius="full"
                  h={1.5}
                  overflow="hidden"
                >
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
          )}
        </Flex>
      </Flex>
    </VStack>
  );
};
