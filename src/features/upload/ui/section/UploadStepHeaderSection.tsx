import { Box, Text, VStack } from "@chakra-ui/react";

import { ProjectStepIndicator, ROADMAP_TYPE_LABEL } from "@/entities";

import { useUploadStepNavigation, useUploadStepProject } from "../../hooks";

type Props = {
  projectId: string;
  stepNum: number;
};

export const UploadStepHeaderSection = ({ projectId, stepNum }: Props) => {
  const { project, steps, completedStepCodes, selectableStepCodes } =
    useUploadStepProject({ projectId, stepNum });
  const { goToStep } = useUploadStepNavigation({
    projectId,
    stepNum,
  });

  return (
    <>
      <VStack align="flex-start" gap={{ base: 4, md: 6 }} w="full">
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
        <ProjectStepIndicator
          activeStep={stepNum}
          completedStepCodes={completedStepCodes}
          selectableStepCodes={selectableStepCodes}
          stepCodes={steps}
          onStepSelect={goToStep}
        />
      )}
    </>
  );
};
