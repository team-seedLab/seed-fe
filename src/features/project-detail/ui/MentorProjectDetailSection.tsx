import { Text, VStack } from "@chakra-ui/react";

import {
  type MentorProjectDetailResponse,
  ProjectStepIndicator,
  useCompleteMentorProjectReview,
} from "@/entities";

import { useProjectDetailStepSelection } from "../hooks";

import { MentorProjectInitialIntentSection } from "./MentorProjectInitialIntentSection";
import { MentorProjectReviewSection } from "./MentorProjectReviewSection";
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
  const { isPending: isCompletingReview, mutate: completeReview } =
    useCompleteMentorProjectReview(project.projectId);

  return (
    <VStack align="flex-start" gap={{ base: 10, md: 16 }} w="full">
      <MentorProjectReviewSection
        isCompleting={isCompletingReview}
        reviewedAt={project.reviewedAt}
        status={project.reviewStatus}
        onComplete={completeReview}
      />

      <MentorProjectInitialIntentSection
        desiredOutcome={project.desiredOutcome}
        keyFocus={project.keyFocus}
        requiredElements={project.requiredElements}
      />

      <VStack align="flex-start" gap={{ base: 6, md: 8 }} w="full">
        <Text
          as="h2"
          color="neutral.900"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
        >
          단계별 기록
        </Text>
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
