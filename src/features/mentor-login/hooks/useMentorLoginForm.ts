import { useState } from "react";

type SubmitValues = {
  email: string;
  password: string;
};

type Params = {
  onSubmit?: (values: SubmitValues) => Promise<void> | void;
};

type Result = {
  fields: {
    email: string;
    password: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
  };
  submit: {
    canSubmit: boolean;
    isSubmitting: boolean;
    errorMessage: string | null;
    submitMentorLogin: () => Promise<void>;
  };
};

export const useMentorLoginForm = ({ onSubmit }: Params = {}): Result => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  const submitMentorLogin = async () => {
    if (isSubmitting) {
      return;
    }

    if (!canSubmit) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onSubmit?.({
        email,
        password,
      });
    } catch {
      setErrorMessage("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fields: {
      email,
      password,
      setEmail,
      setPassword,
    },
    submit: {
      canSubmit,
      isSubmitting,
      errorMessage,
      submitMentorLogin,
    },
  };
};
