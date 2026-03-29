import { useRef } from "react";

import { Box, Flex, Input } from "@chakra-ui/react";

import {
  UploadAssignmentTypeSection,
  UploadContentAndFileSection,
  UploadSubmitSection,
  useUploadPageForm,
} from "@/features";

const MAX_FILES = 3;
const MAX_CONTENT_LENGTH = 1000;

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const {
    title,
    selectedType,
    content,
    uploadedFiles,
    isDragging,
    isPending,
    canSubmit,
    stepCount,
    setTitle,
    setSelectedType,
    setContent,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInput,
    startAnalysis,
  } = useUploadPageForm({
    initialSelectedType: "글쓰기형",
    maxFiles: MAX_FILES,
  });

  return (
    <Flex align="center" bg="white" direction="column" minH="100vh">
      <Flex
        align="center"
        direction="column"
        gap={12}
        maxW="1024px"
        px={6}
        py={20}
        w="full"
      >
        <Box maxW="768px" w="full">
          <Input
            border="none"
            color={title ? "neutral.900" : "neutral.300"}
            fontSize="4xl"
            fontWeight="bold"
            placeholder="프로젝트 제목을 입력하세요"
            textAlign="center"
            value={title}
            _focusVisible={{ outline: "none", boxShadow: "none" }}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        <Flex
          bg="white"
          borderRadius="4xl"
          boxShadow="0px 20px 60px -10px rgba(0,0,0,0.08)"
          direction="column"
          gap={12}
          p={12}
          w="full"
        >
          <UploadAssignmentTypeSection
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />

          <UploadContentAndFileSection
            addFileInputRef={addFileInputRef}
            content={content}
            fileInputRef={fileInputRef}
            isDragging={isDragging}
            maxContentLength={MAX_CONTENT_LENGTH}
            maxFiles={MAX_FILES}
            uploadedFiles={uploadedFiles}
            onContentChange={setContent}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onFileInput={handleFileInput}
            onRemoveFile={removeFile}
          />

          <UploadSubmitSection
            canSubmit={canSubmit}
            isPending={isPending}
            stepCount={stepCount}
            onSubmit={startAnalysis}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
