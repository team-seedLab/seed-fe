import { Button, Text } from "@chakra-ui/react";

type Props = {
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  label: string;
};

export const ToolbarToggleButton = ({
  isActive,
  onToggle,
  children,
  label,
}: Props) => {
  return (
    <Button
      variant="ghost"
      gap={1.5}
      px={3}
      py={1.5}
      h="auto"
      borderRadius="lg"
      bg="bottom.bg.secondary"
      color={isActive ? "seed" : "neutral.600"}
      _hover={{ bg: "neutral.100" }}
      onClick={onToggle}
    >
      {children}
      <Text fontSize="sm" fontWeight="medium">
        {label}
      </Text>
    </Button>
  );
};
