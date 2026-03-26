import { Button } from "@chakra-ui/react";

import { ArrowLeftIcon } from "@/shared/_assets/icons";

type Props = {
  label: string;
  onClick: () => void;
};

export const BackButton = ({ label, onClick }: Props) => {
  return (
    <Button
      alignSelf="flex-start"
      color="neutral.600"
      fontSize="sm"
      fontWeight="medium"
      gap={1}
      onClick={onClick}
      px={0}
      variant="ghost"
      _hover={{ color: "neutral.900" }}
    >
      <ArrowLeftIcon boxSize={3} />
      {label}
    </Button>
  );
};
