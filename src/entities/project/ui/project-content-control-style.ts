import type { SystemStyleObject } from "@chakra-ui/react";

export const PROJECT_CONTENT_CONTROL_BASE_STYLE = {
  borderRadius: "full",
  fontSize: { base: "2xs", md: "xs" },
  fontWeight: "semibold",
  h: 8,
  px: { base: 2, md: 3 },
} as const satisfies SystemStyleObject;

export const PROJECT_CONTENT_CONTROL_SURFACE_STYLE = {
  bg: "white",
  border: "1px solid",
  borderColor: "neutral.50",
  boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
} as const satisfies SystemStyleObject;
