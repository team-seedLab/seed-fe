import { describe, expect, it } from "vitest";

import { isSupportedUploadFile } from "./file-type";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const createFile = (name: string, type: string, size: number) => {
  const file = new File(["content"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("isSupportedUploadFile", () => {
  it("PDF 확장자와 형식이 일치하고 제한 크기 이하면 허용한다", () => {
    const file = createFile("assignment.pdf", "application/pdf", MAX_FILE_SIZE);

    expect(isSupportedUploadFile(file, MAX_FILE_SIZE)).toBe(true);
  });

  it("이미지 파일은 허용하지 않는다", () => {
    const file = createFile("assignment.png", "image/png", 1024);

    expect(isSupportedUploadFile(file, MAX_FILE_SIZE)).toBe(false);
  });

  it("PDF라도 제한 크기를 초과하면 허용하지 않는다", () => {
    const file = createFile(
      "assignment.pdf",
      "application/pdf",
      MAX_FILE_SIZE + 1,
    );

    expect(isSupportedUploadFile(file, MAX_FILE_SIZE)).toBe(false);
  });

  it("PDF 확장자와 MIME 형식이 일치하지 않으면 허용하지 않는다", () => {
    const file = createFile("assignment.pdf", "image/png", 1024);

    expect(isSupportedUploadFile(file, MAX_FILE_SIZE)).toBe(false);
  });
});
