export type AssignmentTypeId =
  | "writing"
  | "paper"
  | "presentation"
  | "lab"
  | "summary"
  | "study";

export type LocalIconDefinition = {
  paths: string[];
  viewBox?: string;
};

export type RoadmapStep = {
  description: string;
  icon: LocalIconDefinition;
  stepNumber: number;
  tagLabel: string;
  title: string;
};

export type SolutionAssignmentCard = {
  description: string;
  icon: LocalIconDefinition;
  id: AssignmentTypeId;
  roadmapSteps: RoadmapStep[];
  title: string;
};
