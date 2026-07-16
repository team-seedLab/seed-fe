import { describe, expect, it } from "vitest";

import {
  readUploadStepResultDraft,
  removeUploadStepResultDraft,
  writeUploadStepResultDraft,
} from "./upload-step-result-draft-storage";

const EDITOR_KEY = "project-1:constraint_analysis";

describe("upload step result draft storage", () => {
  it("단계별 학습 결과 초안을 저장하고 제거한다", () => {
    writeUploadStepResultDraft(EDITOR_KEY, "저장되지 않은 학습 결과");

    expect(readUploadStepResultDraft(EDITOR_KEY)).toBe(
      "저장되지 않은 학습 결과",
    );

    removeUploadStepResultDraft(EDITOR_KEY);

    expect(readUploadStepResultDraft(EDITOR_KEY)).toBeNull();
  });
});
