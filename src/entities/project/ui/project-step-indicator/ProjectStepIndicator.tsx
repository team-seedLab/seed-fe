import { Box, Flex } from "@chakra-ui/react";

import { ROADMAP_STEP_NAMES } from "../../model/constants";

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
    <Box overflowX={{ base: "auto", md: "visible" }} w="full">
      <Flex
        align="flex-start"
        justify={{ base: "flex-start", md: "space-between" }}
        maxW={{ base: "none", md: "672px" }}
        mx={{ base: 0, md: "auto" }}
        px={{ base: 4, md: 0 }}
        role="list"
        w={{ base: "max-content", md: "full" }}
      >
        {stepCodes.map((code, index) => {
          const step = index + 1;
          const isLast = index === stepCodes.length - 1;
          const isSelectable =
            !selectableStepCodes || selectableStepCodes.includes(code);

          return (
            <Flex align="flex-start" flexShrink={0} key={code} role="listitem">
              <ProjectStepIndicatorItem
                isActive={step === activeStep}
                isCompleted={completedStepCodes.includes(code)}
                step={step}
                stepName={ROADMAP_STEP_NAMES[code] ?? code}
                onSelect={
                  onStepSelect && isSelectable
                    ? () => onStepSelect(step)
                    : undefined
                }
              />

              {!isLast && (
                <Box
                  alignSelf="flex-start"
                  bg="neutral.100"
                  flexShrink={0}
                  h="2px"
                  mt={{ base: "19px", md: "23px" }}
                  w={{ base: "24px", md: "48px" }}
                />
              )}
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};
