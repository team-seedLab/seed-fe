import { type AssignmentType } from "@/entities";

export const UPLOAD_ASSIGNMENT_TYPES: AssignmentType[] = [
  "글쓰기형",
  "논문형",
  "발표형",
  "실습형",
  "요약형",
  "학습형",
];

export const DEFAULT_UPLOAD_ASSIGNMENT_TYPE: AssignmentType =
  UPLOAD_ASSIGNMENT_TYPES[0]!;
