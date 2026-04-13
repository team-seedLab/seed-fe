import { useRef } from "react";

import { Flex } from "@chakra-ui/react";

import {
  UploadAssignmentTypeSection,
  UploadContentAndFileSection,
  UploadSubmitSection,
  UploadTitleSection,
  useUploadPageForm,
} from "@/features";

const MAX_FILES = 3;
const MAX_CONTENT_LENGTH = 1000;

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const { fields, files, submit } = useUploadPageForm({ maxFiles: MAX_FILES });

  return (
    <Flex align="center" bg="white" direction="column" minH="100vh">
      <Flex
        align="center"
        direction="column"
        gap={{ base: 8, md: 12 }}
        maxW="1024px"
        px={{ base: 4, md: 6 }}
        py={{ base: 8, md: 14, lg: 20 }}
        w="full"
      >
        <UploadTitleSection title={fields.title} onChange={fields.setTitle} />

        <Flex
          bg="white"
          borderRadius={{ base: "3xl", md: "4xl" }}
          boxShadow="0px 20px 60px -10px rgba(0,0,0,0.08)"
          direction="column"
          gap={{ base: 8, md: 12 }}
          p={{ base: 4, md: 8, lg: 12 }}
          w="full"
        >
          <UploadAssignmentTypeSection
            selectedType={fields.selectedType}
            onSelectType={fields.setSelectedType}
          />

          <UploadContentAndFileSection
            addFileInputRef={addFileInputRef}
            content={fields.content}
            fileInputRef={fileInputRef}
            isDragging={files.isDragging}
            maxContentLength={MAX_CONTENT_LENGTH}
            maxFiles={MAX_FILES}
            uploadedFiles={files.uploadedFiles}
            onContentChange={fields.setContent}
            onDragLeave={files.handleDragLeave}
            onDragOver={files.handleDragOver}
            onDrop={files.handleDrop}
            onFileInput={files.handleFileInput}
            onRemoveFile={files.removeFile}
          />

          <UploadSubmitSection
            canSubmit={submit.canSubmit}
            isPending={submit.isPending}
            stepCount={submit.stepCount}
            onSubmit={submit.startAnalysis}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
