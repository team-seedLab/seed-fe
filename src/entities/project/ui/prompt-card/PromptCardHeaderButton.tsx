import type { ReactNode } from "react";

import { Button } from "@chakra-ui/react";

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
  return (
    <Button
      aria-pressed={pressed}
      bg={disabled ? "transparent" : "white"}
      border={disabled ? "none" : "1px solid"}
      borderColor="neutral.50"
      borderRadius="full"
      boxShadow={disabled ? "none" : "0px 1px 2px rgba(0,0,0,0.05)"}
      color={disabled ? "neutral.300" : "neutral.900"}
      cursor={disabled ? "not-allowed" : "pointer"}
      disabled={disabled}
      fontSize={{ base: "2xs", md: "xs" }}
      fontWeight="semibold"
      h={8}
      onClick={onClick}
      px={{ base: 2, md: 3 }}
      type="button"
      variant="ghost"
      _disabled={{ opacity: 1 }}
      _hover={{ bg: disabled ? "transparent" : "white" }}
    >
      {children}
    </Button>
  );
};
