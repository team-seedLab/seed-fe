import type { MenteeReviewStatus } from "../types";

export const REVIEW_STATUS_LABEL: Record<MenteeReviewStatus, "O" | "X"> = {
  REVIEWED: "O",
  REVIEW_REQUIRED: "X",
};
