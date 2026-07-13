import { IconButton, Menu, Portal, Text } from "@chakra-ui/react";

import { DeleteIcon, MoreHorizontalIcon } from "@/shared";

type Props = {
  onDelete: () => void;
};

export const ProjectListItemMenu = ({ onDelete }: Props) => {
  return (
    <Menu.Root positioning={{ placement: "bottom-end" }}>
      <Menu.Trigger asChild>
        <IconButton
          aria-label="프로젝트 더보기"
          borderRadius="lg"
          boxSize={8}
          minW={8}
          p={0}
          variant="ghost"
          _hover={{ bg: "neutral.100" }}
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontalIcon color="neutral.600" boxSize={4} />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            bg="container.bg"
            border="1px solid"
            borderColor="neutral.100"
            borderRadius="xl"
            minW="104px"
            p={1}
            onClick={(event) => event.stopPropagation()}
          >
            <Menu.Item
              borderRadius="lg"
              cursor="pointer"
              gap={2}
              px={3}
              py={2}
              value="delete"
              _hover={{ bg: "neutral.50" }}
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
            >
              <DeleteIcon color="neutral.500" boxSize={4} />
              <Text color="text" fontSize="sm">
                삭제
              </Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
