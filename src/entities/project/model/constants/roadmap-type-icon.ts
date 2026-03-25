import {
  AcademicCapIcon,
  BeakerIcon,
  BoardTeacherIcon,
  DocumentTextIcon,
  FilePenIcon,
  ScriptIcon,
} from "@/shared";

import type { RoadmapType } from "../types";

export const ROADMAP_TYPE_ICON: Record<RoadmapType, typeof FilePenIcon> = {
  REPORT: FilePenIcon,
  PAPER: AcademicCapIcon,
  PRESENTATION: BoardTeacherIcon,
  EXPERIMENT: BeakerIcon,
  STUDY_SUMMARY: DocumentTextIcon,
  STUDY_LEARNING: ScriptIcon,
};
