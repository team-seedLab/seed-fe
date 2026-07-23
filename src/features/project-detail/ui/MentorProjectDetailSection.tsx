import { Text, VStack } from "@chakra-ui/react";

import {
  type MentorProjectDetailResponse,
  ProjectStepIndicator,
} from "@/entities";

import { SAMPLE_MENTOR_PROJECT_AI_DEPENDENCY } from "../constants";
import { useProjectDetailStepSelection } from "../hooks";

import { MentorProjectAiDependencySection } from "./MentorProjectAiDependencySection";
import { MentorProjectInitialIntentSection } from "./MentorProjectInitialIntentSection";
import { MentorProjectStepRecord } from "./MentorProjectStepRecord";

type Props = {
  project: MentorProjectDetailResponse;
};

export const MentorProjectDetailSection = ({ project }: Props) => {
  const {
    activeStep,
    completedStepCodes,
    orderedStepCodes,
    selectableStepCodes,
    selectedStep,
    selectStep,
  } = useProjectDetailStepSelection(project.steps);

  return (
    <VStack align="flex-start" gap={{ base: 10, md: 16 }} w="full">
      <MentorProjectAiDependencySection
        metrics={SAMPLE_MENTOR_PROJECT_AI_DEPENDENCY}
      />

      <MentorProjectInitialIntentSection
        desiredOutcome={project.desiredOutcome}
        keyFocus={project.keyFocus}
        requiredElements={project.requiredElements}
      />

      <VStack align="flex-start" gap={{ base: 6, md: 8 }} w="full">
        <ProjectStepIndicator
          activeStep={activeStep}
          completedStepCodes={completedStepCodes}
          selectableStepCodes={selectableStepCodes}
          stepCodes={orderedStepCodes}
          onStepSelect={selectStep}
        />

        {selectedStep ? (
          <MentorProjectStepRecord
            key={selectedStep.stepId}
            step={selectedStep}
          />
        ) : (
          <Text color="neutral.600" fontSize={{ base: "sm", md: "md" }}>
            조회할 수 있는 단계 기록이 없습니다.
          </Text>
        )}
      </VStack>
    </VStack>
  );
};
