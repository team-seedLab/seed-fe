import { useRef } from "react";

import { Flex } from "@chakra-ui/react";

import {
  MAX_UPLOAD_FILE_COUNT,
  MAX_UPLOAD_FILE_SIZE,
  MAX_UPLOAD_INTENT_LENGTH,
  UploadAssignmentTypeSection,
  UploadContentAndFileSection,
  UploadSubmitSection,
  UploadTitleSection,
  useUploadPageForm,
} from "@/features";

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const { fields, files, submit } = useUploadPageForm({
    maxFiles: MAX_UPLOAD_FILE_COUNT,
    maxFileSize: MAX_UPLOAD_FILE_SIZE,
  });

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
            content={fields.desiredOutcome}
            fileInputRef={fileInputRef}
            isDragging={files.isDragging}
            maxContentLength={MAX_UPLOAD_INTENT_LENGTH}
            maxFiles={MAX_UPLOAD_FILE_COUNT}
            uploadedFiles={files.uploadedFiles}
            onContentChange={fields.setDesiredOutcome}
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
