import type { ComponentType } from "react";

import type { IconProps } from "@chakra-ui/react";

export type AssignmentTypeId =
  | "writing"
  | "paper"
  | "presentation"
  | "lab"
  | "summary"
  | "study";

export type SharedIconComponent = ComponentType<IconProps>;

export type RoadmapStep = {
  description: string;
  icon: SharedIconComponent;
  stepNumber: number;
  tagLabel: string;
  title: string;
};

export type SolutionAssignmentCard = {
  description: string;
  icon: SharedIconComponent;
  id: AssignmentTypeId;
  roadmapSteps: RoadmapStep[];
  title: string;
};
