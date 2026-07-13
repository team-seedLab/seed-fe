import type { ChangeEvent, DragEvent, RefObject } from "react";

import { Grid } from "@chakra-ui/react";

import { UPLOAD_FILE_ACCEPT } from "../../../constants";
import type { UploadedFile } from "../../../hooks";

import { UploadFileAddButton } from "./UploadFileAddButton";
import { UploadFileItem } from "./UploadFileItem";

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

export const UploadFileList = ({
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
    <>
      <input
        ref={fileInputRef}
        accept={UPLOAD_FILE_ACCEPT}
        aria-label="참고자료 파일 선택"
        multiple
        style={{ display: "none" }}
        type="file"
        onChange={onFileInput}
      />
      <Grid gap={3} templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}>
        {uploadedFiles.map(({ id, file }) => (
          <UploadFileItem
            key={id}
            file={file}
            onRemove={() => onRemoveFile(id)}
          />
        ))}

        {uploadedFiles.length < maxFiles ? (
          <UploadFileAddButton
            isDragging={isDragging}
            onClick={() => fileInputRef.current?.click()}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ) : null}
      </Grid>
    </>
  );
};
