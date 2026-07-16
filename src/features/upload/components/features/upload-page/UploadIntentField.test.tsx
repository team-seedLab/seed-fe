import { useState } from "react";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadIntentField } from "./UploadIntentField";

const UploadIntentFieldTestHarness = () => {
  const [value, setValue] = useState("");

  return (
    <UploadIntentField
      id="desired-outcome"
      label="원하는 결과물"
      maxLength={2_000}
      placeholder="원하는 결과물을 입력해 주세요."
      value={value}
      onChange={setValue}
    />
  );
};

describe("UploadIntentField", () => {
  it("입력 내용에 따라 높이를 자동으로 조절한다", async () => {
    renderWithProviders(<UploadIntentFieldTestHarness />);

    const input = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "원하는 결과물",
    });
    Object.defineProperty(input, "scrollHeight", {
      configurable: true,
      value: 180,
    });

    fireEvent.input(input, {
      target: { value: "여러 줄로 작성한 원하는 결과물" },
    });

    await waitFor(() => {
      expect(input).toHaveStyle({ height: "180px", resize: "none" });
    });
  });
});
