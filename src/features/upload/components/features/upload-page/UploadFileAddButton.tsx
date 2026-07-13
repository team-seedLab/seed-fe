import type { DragEvent } from "react";

import { Button, Text } from "@chakra-ui/react";

import { PlusIcon } from "@/shared";

type Props = {
  isDragging: boolean;
  onClick: () => void;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
};

export const UploadFileAddButton = ({
  isDragging,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
}: Props) => {
  return (
    <Button
      aria-label="참고자료 추가"
      bg={isDragging ? "seed.subtle" : "white"}
      border="1px dashed"
      borderColor={isDragging ? "seed" : "neutral.300"}
      borderRadius="lg"
      color="neutral.600"
      gap={2}
      h={14}
      type="button"
      variant="plain"
      w="full"
      _hover={{ borderColor: "seed", color: "seed" }}
      onClick={onClick}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <PlusIcon boxSize={3} />
      <Text fontSize="xs" fontWeight="medium">
        PDF 추가
      </Text>
    </Button>
  );
};
