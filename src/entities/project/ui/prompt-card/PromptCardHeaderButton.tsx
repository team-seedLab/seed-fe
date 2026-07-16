import type { ReactNode } from "react";

import { Button } from "@chakra-ui/react";

import {
  PROJECT_CONTENT_CONTROL_BASE_STYLE,
  PROJECT_CONTENT_CONTROL_SURFACE_STYLE,
} from "../project-content-control-style";

type Props = {
  children: ReactNode;
  disabled?: boolean;
  pressed?: boolean;
  onClick: () => void;
};

export const PromptCardHeaderButton = ({
  children,
  disabled = false,
  pressed,
  onClick,
}: Props) => {
  const surfaceStyle = disabled
    ? {
        bg: "transparent",
        border: "1px solid",
        borderColor: "transparent",
        boxShadow: "none",
      }
    : PROJECT_CONTENT_CONTROL_SURFACE_STYLE;

  return (
    <Button
      {...PROJECT_CONTENT_CONTROL_BASE_STYLE}
      {...surfaceStyle}
      aria-pressed={pressed}
      color={disabled ? "neutral.300" : "neutral.900"}
      cursor={disabled ? "not-allowed" : "pointer"}
      disabled={disabled}
      onClick={onClick}
      type="button"
      variant="ghost"
      _disabled={{ opacity: 1 }}
      _hover={{
        bg: disabled ? "transparent" : PROJECT_CONTENT_CONTROL_SURFACE_STYLE.bg,
      }}
    >
      {children}
    </Button>
  );
};
