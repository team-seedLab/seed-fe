import { Box, Text, VStack } from "@chakra-ui/react";

import { ROADMAP_TYPE_LABEL } from "@/entities";
import { BackButton } from "@/shared";

import { UploadStepIndicator } from "../../components";
import { useUploadStepNavigation, useUploadStepProject } from "../../hooks";

type Props = {
  projectId: string;
  stepNum: number;
};

export const UploadStepHeaderSection = ({ projectId, stepNum }: Props) => {
  const { project, steps } = useUploadStepProject({ projectId, stepNum });
  const { goToPrevStep } = useUploadStepNavigation({ projectId, stepNum });

  return (
    <>
      <VStack align="flex-start" gap={{ base: 4, md: 6 }} w="full">
        <BackButton label="이전 단계로" onClick={goToPrevStep} />

        <VStack align="flex-start" gap={2} w="full">
          <Box
            bg="neutral.50"
            border="1px solid white"
            borderRadius="md"
            color="neutral.600"
            fontSize="2xs"
            fontWeight="regular"
            px={{ base: 2, md: "9px" }}
            py={{ base: 1, md: "5px" }}
          >
            {project?.roadmapType
              ? (ROADMAP_TYPE_LABEL[project.roadmapType] ?? project.roadmapType)
              : ""}
          </Box>
          <Text
            color="neutral.900"
            fontSize={{ base: "xl", md: "3xl" }}
            fontWeight="bold"
            lineHeight="1.4"
            w="full"
            wordBreak="keep-all"
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
