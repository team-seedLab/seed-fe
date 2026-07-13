import { VStack } from "@chakra-ui/react";

import { UploadIntentField, UploadSectionHeading } from "../../components";

type Props = {
  desiredOutcome: string;
  keyFocus: string;
  requiredElements: string;
  maxLength: number;
  onDesiredOutcomeChange: (value: string) => void;
  onKeyFocusChange: (value: string) => void;
  onRequiredElementsChange: (value: string) => void;
};

export const UploadIntentSection = ({
  desiredOutcome,
  keyFocus,
  requiredElements,
  maxLength,
  onDesiredOutcomeChange,
  onKeyFocusChange,
  onRequiredElementsChange,
}: Props) => {
  return (
    <VStack align="stretch" gap={5} w="full">
      <UploadSectionHeading>사용자의 의도 추가</UploadSectionHeading>
      <VStack align="stretch" gap={5} pl={3}>
        <UploadIntentField
          id="desiredOutcome"
          label="원하는 결과물"
          maxLength={maxLength}
          placeholder="어떤 형태의 결과물을 만들고 싶은지 작성해 주세요."
          value={desiredOutcome}
          onChange={onDesiredOutcomeChange}
        />
        <UploadIntentField
          id="keyFocus"
          label="핵심 관점"
          maxLength={maxLength}
          placeholder="결과물에서 집중하고 싶은 관점을 작성해 주세요."
          value={keyFocus}
          onChange={onKeyFocusChange}
        />
        <UploadIntentField
          id="requiredElements"
          label="가장 중요한 요소"
          maxLength={maxLength}
          placeholder="반드시 포함되어야 하는 내용을 작성해 주세요."
          value={requiredElements}
          onChange={onRequiredElementsChange}
        />
      </VStack>
    </VStack>
  );
};
