import { useRef, useState } from "react";
import type React from "react";

import { useWaitList } from "./useWaitList";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export const useSendEmail = () => {
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isSubmittingRef = useRef(false);

  const { submit } = useWaitList();

  const submitWaitlistEmail = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const result = await submit(trimmedEmail);

      if (!result.success) {
        setErrorMessage(
          result.errorMessage ??
            "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
        setSubmitStatus("error");
      } else {
        setSubmitStatus("success");
      }
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const submitOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submitWaitlistEmail();
  };

  return {
    email,
    setEmail,
    submitStatus,
    errorMessage,
    submitWaitlistEmail,
    submitOnEnter,
  };
};
