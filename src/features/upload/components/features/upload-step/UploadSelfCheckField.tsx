import { HStack, Text, Textarea, VStack } from "@chakra-ui/react";

import {
  SELF_CHECK_ANSWER_MAX_LENGTH,
  SELF_CHECK_ANSWER_MIN_LENGTH,
} from "../../../constants";

type Props = {
  answer: string;
  question: string;
  onChange: (answer: string) => void;
};

export const UploadSelfCheckField = ({ answer, question, onChange }: Props) => {
  return (
    <VStack align="stretch" gap={3} w="full">
      <Text color="neutral.900" fontSize="sm" fontWeight="semibold">
        {question}
      </Text>
      <Textarea
        aria-label={question}
        autoresize
        bg="neutral.50"
        border="none"
        borderRadius="xl"
        color="neutral.900"
        fontSize="sm"
        maxLength={SELF_CHECK_ANSWER_MAX_LENGTH}
        minH={44}
        onChange={(event) => onChange(event.target.value)}
        p={6}
        placeholder="여기에 작성해 주세요."
        value={answer}
        _focusVisible={{
          boxShadow: "0 0 0 1px var(--sd-colors-seed)",
          outline: "none",
        }}
        _placeholder={{ color: "text.placeholder" }}
      />
      <HStack justify="space-between">
        <Text color="neutral.600" fontSize="xs">
          공백 제외 {SELF_CHECK_ANSWER_MIN_LENGTH}자 이상 작성해 주세요.
        </Text>
        <Text color="neutral.600" fontSize="xs">
          {answer.length.toLocaleString()} /{" "}
          {SELF_CHECK_ANSWER_MAX_LENGTH.toLocaleString()}자
        </Text>
      </HStack>
    </VStack>
  );
};
