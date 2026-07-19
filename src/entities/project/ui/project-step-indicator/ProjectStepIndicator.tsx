import { Box, Flex } from "@chakra-ui/react";

import { ROADMAP_STEP_NAMES } from "../../model/constants";

import { ProjectStepIndicatorConnector } from "./ProjectStepIndicatorConnector";
import { ProjectStepIndicatorItem } from "./ProjectStepIndicatorItem";

type Props = {
  activeStep: number;
  stepCodes: readonly string[];
  completedStepCodes?: readonly string[];
  selectableStepCodes?: readonly string[];
  onStepSelect?: (step: number) => void;
};

export const ProjectStepIndicator = ({
  activeStep,
  stepCodes,
  completedStepCodes = [],
  selectableStepCodes,
  onStepSelect,
}: Props) => {
  return (
    <Box overflowX="auto" w="full">
      <Flex
        align="flex-start"
        maxW={{ base: "none", md: "672px" }}
        mx={{ base: 0, md: "auto" }}
        px={{ base: 4, md: 0 }}
        role="list"
        w={{ base: "max-content", md: "full" }}
      >
        {stepCodes.map((code, index) => {
          const step = index + 1;
          const isLast = index === stepCodes.length - 1;
          const isActive = step === activeStep;
          const isCompleted = completedStepCodes.includes(code);
          const isCurrentStepActivated = isActive || isCompleted;
          const nextCode = stepCodes[index + 1];
          const isNextStepActive =
            nextCode !== undefined && step + 1 === activeStep;
          const isNextStepCompleted =
            nextCode !== undefined && completedStepCodes.includes(nextCode);
          const isNextStepActivated = isNextStepActive || isNextStepCompleted;
          const isSelectable =
            !selectableStepCodes || selectableStepCodes.includes(code);

          return (
            <Flex
              align="flex-start"
              flex={{ base: "0 0 112px", md: "1 1 0" }}
              justify="center"
              key={code}
              minW={{ base: "112px", md: "96px" }}
              position="relative"
              role="listitem"
            >
              {!isLast && (
                <ProjectStepIndicatorConnector
                  isActive={isCurrentStepActivated && isNextStepActivated}
                />
              )}

              <ProjectStepIndicatorItem
                isActive={isActive}
                isCompleted={isCompleted}
                step={step}
                stepName={ROADMAP_STEP_NAMES[code] ?? code}
                onSelect={
                  onStepSelect && isSelectable
                    ? () => onStepSelect(step)
                    : undefined
                }
              />
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
