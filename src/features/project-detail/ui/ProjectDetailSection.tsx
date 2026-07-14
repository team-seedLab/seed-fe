import { VStack } from "@chakra-ui/react";

import type { ProjectDetailResponse } from "@/entities";

import { ProjectStepRecord } from "./ProjectStepRecord";

type Props = {
  project: ProjectDetailResponse;
};

export const ProjectDetailSection = ({ project }: Props) => {
  const startedSteps = project.steps.filter(
    (step) => step.status !== "PENDING",
  );

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
      {startedSteps.map((step) => (
        <ProjectStepRecord
          key={step.stepId}
          projectId={project.projectId}
          stepCode={step.stepCode}
          stepNumber={step.stepOrder}
        />
      ))}
    </VStack>
  );
};
