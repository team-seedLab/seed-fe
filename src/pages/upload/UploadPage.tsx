import type { FormEvent } from "react";
import { useRef } from "react";

import { Flex, VStack } from "@chakra-ui/react";

import {
  MAX_UPLOAD_FILE_COUNT,
  MAX_UPLOAD_FILE_SIZE,
  MAX_UPLOAD_INTENT_LENGTH,
  UploadAssignmentTypeSection,
  UploadIntentSection,
  UploadReferenceFileSection,
  UploadSectionHeading,
  UploadSubmitSection,
  UploadTitleSection,
  useUploadPageForm,
} from "@/features";

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fields, files, submit } = useUploadPageForm({
    maxFiles: MAX_UPLOAD_FILE_COUNT,
    maxFileSize: MAX_UPLOAD_FILE_SIZE,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit.startAnalysis();
  };

  return (
    <Flex bg="white" justify="center" minH="100vh" w="full">
      <form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <VStack
          align="stretch"
          gap={{ base: 10, md: 14 }}
          maxW="768px"
          mx="auto"
          px={{ base: 5, md: 6 }}
          py={{ base: 10, md: 16 }}
          w="full"
        >
          <UploadTitleSection title={fields.title} onChange={fields.setTitle} />

          <VStack align="stretch" gap={5} w="full">
            <UploadSectionHeading>프로젝트 설정</UploadSectionHeading>
            <VStack align="stretch" gap={5} pl={3}>
              <UploadAssignmentTypeSection
                selectedType={fields.selectedType}
                onSelectType={fields.setSelectedType}
              />
              <UploadReferenceFileSection
                fileInputRef={fileInputRef}
                isDragging={files.isDragging}
                maxFiles={MAX_UPLOAD_FILE_COUNT}
                uploadedFiles={files.uploadedFiles}
                onDragLeave={files.handleDragLeave}
                onDragOver={files.handleDragOver}
                onDrop={files.handleDrop}
                onFileInput={files.handleFileInput}
                onRemoveFile={files.removeFile}
              />
            </VStack>
          </VStack>

          <UploadIntentSection
            desiredOutcome={fields.desiredOutcome}
            keyFocus={fields.keyFocus}
            maxLength={MAX_UPLOAD_INTENT_LENGTH}
            requiredElements={fields.requiredElements}
            onDesiredOutcomeChange={fields.setDesiredOutcome}
            onKeyFocusChange={fields.setKeyFocus}
            onRequiredElementsChange={fields.setRequiredElements}
          />

          <UploadSubmitSection
            canSubmit={submit.canSubmit}
            isPending={submit.isPending}
          />
        </VStack>
      </form>
    </Flex>
  );
}
