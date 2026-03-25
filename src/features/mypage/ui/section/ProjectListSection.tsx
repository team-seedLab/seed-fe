import { useState } from "react";
import { useNavigate } from "react-router";

import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";

import {
  ProjectListItem,
  type ProjectStatus,
  useDeleteProject,
  useGetProjectList,
} from "@/entities";
import {
  ConfirmDialog,
  DYNAMIC_ROUTE_PATHS,
  Pagination,
  PlusIcon,
  ROUTE_PATHS,
} from "@/shared";

import { ProjectListToolbar } from "../../components";

export const ProjectListSection = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | undefined>(
    undefined,
  );
  const {
    data: projectsListData,
    isLoading,
    isFetching,
  } = useGetProjectList({
    page: currentPage - 1,
    size: 10,
    sort: "createdAt,DESC",
    status: activeFilter,
  });
  const { mutate: deleteProject } = useDeleteProject();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const totalPages = projectsListData?.totalPages ?? 1;
  const projects = projectsListData?.content ?? [];
  const isInitialLoading = isLoading && projects.length === 0;

  return (
    <VStack gap={6} align="flex-start" pt={4} w="full">
      <Flex w="full" align="center" justify="space-between" px={2}>
        <Text color="text" fontSize="xl" fontWeight="bold">
          내 프로젝트 목록
        </Text>
        <ProjectListToolbar
          activeFilter={activeFilter}
          onFilterChange={(filter) => {
            setActiveFilter(filter);
            setCurrentPage(1);
          }}
        />
      </Flex>

      <VStack
        gap={3}
        w="full"
        position="relative"
        minH={{ base: "360px", md: "420px" }}
      >
        {projects.map((project) => (
          <ProjectListItem
            key={project.projectId}
            name={project.title}
            onClick={() =>
              navigate(DYNAMIC_ROUTE_PATHS.PROJECT_DETAIL(project.projectId))
            }
            updatedAt={project.createdAt}
            status={project.status}
            roadmapType={project.roadmapType}
            onDelete={() =>
              setDeleteTarget({
                id: project.projectId,
                title: project.title,
              })
            }
          />
        ))}

        {isInitialLoading ? (
          <Flex
            position="absolute"
            inset={0}
            align="center"
            justify="center"
            bg="neutral.0"
          >
            <Spinner color="seed" size="lg" />
          </Flex>
        ) : null}

        {isFetching && !isInitialLoading ? (
          <Flex
            position="absolute"
            top={0}
            right={0}
            px={2}
            py={1}
            borderRadius="md"
            bg="neutral.0"
            align="center"
            gap={2}
          >
            <Spinner color="seed" size="sm" />
            <Text color="text.secondary" fontSize="xs">
              불러오는 중...
            </Text>
          </Flex>
        ) : null}

        <Flex
          bg="white"
          border="1px dashed"
          borderColor="container.border.dashed"
          borderRadius="2xl"
          boxShadow="0px 8px 30px 0px rgba(0,0,0,0.04)"
          h={24}
          w="full"
          align="center"
          justify="center"
          cursor="pointer"
          _hover={{ bg: "neutral.50" }}
          transition="background 0.15s"
          onClick={() => navigate(ROUTE_PATHS.FILE_UPLOAD)}
        >
          <Flex
            bg="seed.subtle"
            borderRadius="full"
            boxSize={10}
            align="center"
            justify="center"
          >
            <PlusIcon color="seed" boxSize={4.5} />
          </Flex>
        </Flex>
      </VStack>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {deleteTarget && (
        <ConfirmDialog
          open
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null);
          }}
          title="프로젝트 삭제"
          description={`"${deleteTarget.title}" 프로젝트를 삭제하시겠습니까?`}
          confirmLabel="삭제"
          cancelLabel="취소"
          onConfirm={() => deleteProject(deleteTarget.id)}
        />
      )}
    </VStack>
  );
};
