import { useState } from "react";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test/test-utils";

import { UploadSelfCheckField } from "./UploadSelfCheckField";

const QUESTION = "이번 단계에서 이해한 내용을 설명해 주세요.";

const UploadSelfCheckFieldTestHarness = () => {
  const [answer, setAnswer] = useState("");

  return (
    <UploadSelfCheckField
      answer={answer}
      question={QUESTION}
      onChange={setAnswer}
    />
  );
};

describe("UploadSelfCheckField", () => {
  it("답변 내용에 따라 입력창 높이를 자동으로 조절한다", async () => {
    renderWithProviders(<UploadSelfCheckFieldTestHarness />);

    const answerInput = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: QUESTION,
    });
    Object.defineProperty(answerInput, "scrollHeight", {
      configurable: true,
      value: 240,
    });

    fireEvent.input(answerInput, {
      target: { value: "여러 줄로 작성한 Self-Check 답변" },
    });

    await waitFor(() => {
      expect(answerInput).toHaveStyle({ height: "240px", resize: "none" });
    });
  });
});
