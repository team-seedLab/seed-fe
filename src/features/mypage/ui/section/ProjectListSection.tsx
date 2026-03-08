import { useState } from "react";

import { Flex, Text, VStack } from "@chakra-ui/react";

import { PROJECT_LIST_MOCK, type Project, ProjectListItem } from "@/entities";
import { Pagination, PlusIcon } from "@/shared";

import { ProjectListToolbar } from "../../components";

export const ProjectListSection = () => {
  const [filterActive, setFilterActive] = useState(false);
  const [manageActive, setManageActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  return (
    <VStack gap={6} align="flex-start" pt={4} w="full">
      <Flex w="full" align="center" justify="space-between" px={2}>
        <Text color="neutral.900" fontSize="xl" fontWeight="bold">
          내 프로젝트 목록
        </Text>
        <ProjectListToolbar
          filterActive={filterActive}
          setFilterActive={setFilterActive}
          manageActive={manageActive}
          setManageActive={setManageActive}
        />
      </Flex>

      <VStack gap={3} w="full">
        {PROJECT_LIST_MOCK.map((project: Project) => (
          <ProjectListItem
            key={project.id}
            name={project.name}
            updatedAt={project.updatedAt}
          />
        ))}

        <Flex
          bg="white"
          border="1px dashed"
          borderColor="neutral.600"
          borderRadius="2xl"
          boxShadow="0px 8px 30px 0px rgba(0,0,0,0.04)"
          h={24}
          w="full"
          align="center"
          justify="center"
          cursor="pointer"
          _hover={{ bg: "neutral.50" }}
          transition="background 0.15s"
        >
          <Flex
            bg="#F4FAEB"
            borderRadius="full"
            boxSize={10}
            align="center"
            justify="center"
          >
            <PlusIcon color="seed" boxSize="17.5px" />
          </Flex>
        </Flex>
      </VStack>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </VStack>
  );
};
