import { type AssignmentType } from "@/entities";
import {
  AcademicCapIcon,
  BeakerIcon,
  BoardTeacherIcon,
  DocumentTextIcon,
  FilePenIcon,
  StudyIcon,
} from "@/shared";

type UploadAssignmentTypeOption = {
  label: AssignmentType;
  Icon: React.ComponentType<{ color?: string; boxSize?: string | number }>;
};

export const UPLOAD_ASSIGNMENT_TYPES: UploadAssignmentTypeOption[] = [
  { label: "글쓰기형", Icon: FilePenIcon },
  { label: "논문형", Icon: AcademicCapIcon },
  { label: "발표형", Icon: BoardTeacherIcon },
  { label: "실습형", Icon: BeakerIcon },
  { label: "요약형", Icon: DocumentTextIcon },
  { label: "학습형", Icon: StudyIcon },
];

export const DEFAULT_UPLOAD_ASSIGNMENT_TYPE: AssignmentType =
  UPLOAD_ASSIGNMENT_TYPES[0]!.label;
