import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUploadStepNavigation } from "./useUploadStepNavigation";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("useUploadStepNavigation", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("선택한 단계의 업로드 경로로 이동한다", () => {
    const { result } = renderHook(() =>
      useUploadStepNavigation({ projectId: "project-1", stepNum: 2 }),
    );

    act(() => result.current.goToStep(1));

    expect(navigateMock).toHaveBeenCalledWith("/upload/step/project-1/1");
  });
});
