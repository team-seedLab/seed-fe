import { Flex, Text } from "@chakra-ui/react";

import { ChevronRightIcon, DocumentTextIcon } from "@/shared";

type Props = {
  name: string;
  updatedAt: string;
  onClick?: () => void;
};

export const ProjectListItem = ({ name, updatedAt, onClick }: Props) => {
  return (
    <Flex
      bg="white"
      border="1px solid"
      borderColor="neutral.50"
      borderRadius="2xl"
      boxShadow="0px 8px 30px 0px rgba(0,0,0,0.04)"
      p="25px"
      w="full"
      align="center"
      justify="space-between"
      cursor="pointer"
      _hover={{ bg: "neutral.50" }}
      transition="background 0.15s"
      onClick={onClick}
    >
      <Flex gap={5} align="center">
        <Flex
          bg="#F4FAEB"
          borderRadius="xl"
          boxSize={12}
          align="center"
          justify="center"
          flexShrink={0}
        >
          <DocumentTextIcon color="seed" w={4} h={5} />
        </Flex>
        <Flex flexDir="column" align="flex-start">
          <Text color="neutral.900" fontSize="lg" fontWeight="bold">
            {name}
          </Text>
          <Text color="neutral.600" fontSize="xs">
            {updatedAt}
          </Text>
        </Flex>
      </Flex>
      <ChevronRightIcon color="neutral.600" w="7px" h="11px" />
    </Flex>
  );
};
