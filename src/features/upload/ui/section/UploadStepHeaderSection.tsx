import { Box, Text, VStack } from "@chakra-ui/react";

import { BackButton } from "@/shared";

import { useUploadStepProject } from "../../hooks";
import { UploadStepIndicator } from "../UploadStepIndicator";

type Props = {
  projectId: string;
  stepNum: number;
  onGoBack: () => void;
};

export const UploadStepHeaderSection = ({
  projectId,
  stepNum,
  onGoBack,
}: Props) => {
  const { project, steps } = useUploadStepProject({ projectId, stepNum });

  return (
    <>
      <VStack align="flex-start" gap={6}>
        <BackButton label="이전 단계로" onClick={onGoBack} />

        <VStack align="flex-start" gap={2}>
          <Box
            bg="neutral.50"
            border="1px solid white"
            borderRadius="md"
            color="neutral.600"
            fontSize="2xs"
            fontWeight="regular"
            px="9px"
            py="5px"
          >
            {project?.roadmapType}
          </Box>
          <Text
            color="neutral.900"
            fontSize="3xl"
            fontWeight="bold"
            lineHeight="1.4"
          >
            {project?.title}
          </Text>
        </VStack>
      </VStack>

      {steps.length > 0 && (
        <UploadStepIndicator current={stepNum} stepCodes={steps} />
      )}
    </>
  );
};
