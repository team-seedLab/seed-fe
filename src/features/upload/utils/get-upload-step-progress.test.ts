import { describe, expect, it } from "vitest";

import { getUploadStepProgress } from "./get-upload-step-progress";

const STEP_CODES = ["step-1", "step-2", "step-3", "step-4"];

describe("getUploadStepProgress", () => {
  it("첫 미완료 단계를 진행 가능 단계로 계산한다", () => {
    const result = getUploadStepProgress({
      stepCodes: STEP_CODES,
      stepSummaries: [
        { stepCode: "step-1", status: "COMPLETED" },
        { stepCode: "step-2", status: "IN_PROGRESS" },
        { stepCode: "step-3", status: "PENDING" },
      ],
    });

    expect(result.completedStepCodes).toEqual(["step-1"]);
    expect(result.progressStep).toBe(2);
    expect(result.selectableStepCodes).toEqual(["step-1", "step-2"]);
  });

  it("여러 단계가 완료되어도 로드맵 순서로 첫 미완료 단계를 찾는다", () => {
    const result = getUploadStepProgress({
      stepCodes: STEP_CODES,
      stepSummaries: [
        { stepCode: "step-1", status: "COMPLETED" },
        { stepCode: "step-2", status: "COMPLETED" },
        { stepCode: "step-3", status: "COMPLETED" },
        { stepCode: "step-4", status: "IN_PROGRESS" },
      ],
    });

    expect(result.progressStep).toBe(4);
    expect(result.selectableStepCodes).toEqual(STEP_CODES);
  });

  it("모든 단계가 완료되면 마지막 단계를 진행 단계로 유지한다", () => {
    const result = getUploadStepProgress({
      stepCodes: STEP_CODES,
      stepSummaries: STEP_CODES.map((stepCode) => ({
        stepCode,
        status: "COMPLETED" as const,
      })),
    });

    expect(result.progressStep).toBe(4);
    expect(result.selectableStepCodes).toEqual(STEP_CODES);
  });
});
