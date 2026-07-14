import { useState } from "react";

import {
  type ProjectStepSelfCheckAnswer,
  useGetProjectStepSelfCheck,
} from "@/entities";

import {
  SELF_CHECK_ANSWER_MAX_LENGTH,
  SELF_CHECK_ANSWER_MIN_LENGTH,
} from "../constants";
import { getSelfCheckAnswerLength } from "../utils";

type Params = {
  projectId: string;
  stepCode?: string;
};

type AnswerDrafts = Record<string, Record<string, string>>;

export const useUploadStepSelfCheck = ({ projectId, stepCode }: Params) => {
  const [isOpen, setIsOpen] = useState(false);
  const [answerDrafts, setAnswerDrafts] = useState<AnswerDrafts>({});
  const normalizedStepCode = stepCode ?? "";
  const editorKey = `${projectId}:${normalizedStepCode}`;
  const selfCheckQuery = useGetProjectStepSelfCheck(
    projectId,
    normalizedStepCode,
    isOpen,
  );
  const savedCheckItems = selfCheckQuery.data?.checkItems ?? [];
  const currentDrafts = answerDrafts[editorKey] ?? {};
  const checkItems = savedCheckItems.map((item) => ({
    ...item,
    answer: currentDrafts[item.key] ?? item.answer ?? "",
  }));
  const answers: ProjectStepSelfCheckAnswer[] = checkItems.map(
    ({ key, answer }) => ({ key, answer }),
  );
  const isValid =
    checkItems.length > 0 &&
    checkItems.every(({ answer }) => {
      const answerLength = getSelfCheckAnswerLength(answer);

      return (
        answerLength >= SELF_CHECK_ANSWER_MIN_LENGTH &&
        answer.length <= SELF_CHECK_ANSWER_MAX_LENGTH
      );
    });

  const openSelfCheck = () => {
    if (!projectId || !stepCode) {
      return;
    }

    setIsOpen(true);
  };

  const closeSelfCheck = () => {
    setIsOpen(false);
  };

  const changeAnswer = (key: string, answer: string) => {
    setAnswerDrafts((previousDrafts) => {
      const initialAnswers = Object.fromEntries(
        savedCheckItems.map((item) => [item.key, item.answer ?? ""]),
      );

      return {
        ...previousDrafts,
        [editorKey]: {
          ...initialAnswers,
          ...previousDrafts[editorKey],
          [key]: answer,
        },
      };
    });
  };

  return {
    answers,
    changeAnswer,
    checkItems,
    closeSelfCheck,
    isError: selfCheckQuery.isError,
    isLoading: selfCheckQuery.isLoading,
    isOpen,
    isValid,
    openSelfCheck,
    retrySelfCheck: selfCheckQuery.refetch,
  };
};
