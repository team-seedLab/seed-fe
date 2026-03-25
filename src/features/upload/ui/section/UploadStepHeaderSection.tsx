import { Box, Button, Text, VStack } from "@chakra-ui/react";

import { ArrowLeftIcon } from "@/shared/_assets/icons";

import { UploadStepIndicator } from "../UploadStepIndicator";

type Props = {
  projectTitle?: string;
  roadmapType?: string;
  stepNum: number;
  steps: string[];
  onGoBack: () => void;
};

export const UploadStepHeaderSection = ({
  projectTitle,
  roadmapType,
  stepNum,
  steps,
  onGoBack,
}: Props) => {
  return (
    <>
      <VStack align="flex-start" gap={6}>
        <Button
          alignSelf="flex-start"
          color="neutral.600"
          fontSize="sm"
          fontWeight="medium"
          gap={1}
          onClick={onGoBack}
          px={0}
          variant="ghost"
          _hover={{ color: "neutral.900" }}
        >
          <ArrowLeftIcon boxSize={3} />
          이전 단계로
        </Button>

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
            {roadmapType}
          </Box>
          <Text
            color="neutral.900"
            fontSize="3xl"
            fontWeight="bold"
            lineHeight="1.4"
          >
            {projectTitle}
          </Text>
        </VStack>
      </VStack>

      {steps.length > 0 && (
        <UploadStepIndicator current={stepNum} stepCodes={steps} />
      )}
    </>
  );
};
