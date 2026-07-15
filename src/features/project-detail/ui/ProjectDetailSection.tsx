import { Text, VStack } from "@chakra-ui/react";

import { type ProjectDetailResponse, ProjectStepIndicator } from "@/entities";

import { useProjectDetailStepSelection } from "../hooks";

import { ProjectStepRecord } from "./ProjectStepRecord";

type Props = {
  project: ProjectDetailResponse;
};

export const ProjectDetailSection = ({ project }: Props) => {
  const {
    activeStep,
    completedStepCodes,
    orderedStepCodes,
    selectableStepCodes,
    selectedStep,
    selectStep,
  } = useProjectDetailStepSelection(project.steps);

  return (
    <VStack
      align="flex-start"
      bg="white"
      border="1px solid white"
      borderRadius={{ base: "3xl", md: "4xl" }}
      boxShadow="0px 20px 60px -10px rgba(0,0,0,0.08)"
      gap={{ base: 8, md: 12 }}
      overflow="hidden"
      p={{ base: 4, md: 12 }}
      w="full"
    >
      <ProjectStepIndicator
        activeStep={activeStep}
        completedStepCodes={completedStepCodes}
        selectableStepCodes={selectableStepCodes}
        stepCodes={orderedStepCodes}
        onStepSelect={selectStep}
      />

      {selectedStep ? (
        <ProjectStepRecord
          key={selectedStep.stepId}
          projectId={project.projectId}
          stepCode={selectedStep.stepCode}
          stepNumber={selectedStep.stepOrder}
        />
      ) : (
        <Text color="neutral.600" fontSize={{ base: "sm", md: "md" }}>
          조회할 수 있는 단계 기록이 없습니다.
        </Text>
      )}
    </VStack>
  );
};
