import type { MenteeReviewStatus } from "../types";

export const REVIEW_STATUS_LABEL: Record<MenteeReviewStatus, "O" | "X" | "-"> =
  {
    NOT_APPLICABLE: "-",
    REVIEWED: "O",
    REVIEWING: "X",
  };
