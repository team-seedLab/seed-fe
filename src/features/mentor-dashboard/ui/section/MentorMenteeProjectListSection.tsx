import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { Flex, Text, VStack } from "@chakra-ui/react";

import type { ProjectStatus } from "@/entities";
import { DYNAMIC_ROUTE_PATHS, Pagination } from "@/shared";

import {
  MentorMenteeProjectCard,
  MentorMenteeProjectFilterTabs,
} from "../../components";
import type { MentorMenteeProjectGroup } from "../../types";

type Props = {
  menteeId: string;
  projects: MentorMenteeProjectGroup["projects"];
};

const PAGE_SIZE = 3;

export const MentorMenteeProjectListSection = ({
  menteeId,
  projects,
}: Props) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<ProjectStatus | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      return activeFilter ? project.status === activeFilter : true;
    });
  }, [activeFilter, projects]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PAGE_SIZE),
  );
  const currentPageProjects = filteredProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const emptyMessage =
    projects.length === 0
      ? "프로젝트 목록이 준비되면 여기에 표시됩니다."
      : "선택한 상태의 프로젝트가 없습니다.";

  return (
    <VStack align="stretch" gap={{ base: 5, md: 7 }} w="full">
      <Flex
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 0 }}
        justify="space-between"
        px={{ base: 1, md: 3 }}
        w="full"
      >
        <Text
          color="text"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
        >
          프로젝트 목록
        </Text>
        <MentorMenteeProjectFilterTabs
          activeFilter={activeFilter}
          onFilterChange={(filter) => {
            setActiveFilter(filter);
            setCurrentPage(1);
          }}
        />
      </Flex>

      <VStack align="stretch" gap={3} w="full">
        {currentPageProjects.length > 0 ? (
          currentPageProjects.map((project) => {
            return (
              <MentorMenteeProjectCard
                key={project.projectId}
                project={project}
                onClick={() =>
                  navigate(
                    DYNAMIC_ROUTE_PATHS.PROJECT_DETAIL(project.projectId),
                    {
                      state: {
                        backTo:
                          DYNAMIC_ROUTE_PATHS.MENTOR_MENTEE_PROJECTS(menteeId),
                      },
                    },
                  )
                }
              />
            );
          })
        ) : (
          <Flex
            align="center"
            bg="container.bg"
            border="1px solid"
            borderColor="neutral.50"
            borderRadius="2xl"
            color="text.secondary"
            justify="center"
            minH="200px"
            px={6}
          >
            {emptyMessage}
          </Flex>
        )}
      </VStack>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </VStack>
  );
};
