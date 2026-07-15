import { useLocation, useNavigate, useParams } from "react-router";

import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";

import {
  getUserEntryRoutePath,
  useGetProjectDetail,
  useUserInfoStore,
} from "@/entities";
import { ProjectDetailHeaderSection, ProjectDetailSection } from "@/features";
import { BackButton } from "@/shared";

type ProjectDetailLocationState = {
  backTo?: string;
};

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    data: project,
    isError,
    isLoading,
  } = useGetProjectDetail(projectId ?? "");
  const role = useUserInfoStore((state) => {
    return state.userInfo?.role ?? state.persistedProfile?.role;
  });
  const backTo = (location.state as ProjectDetailLocationState | null)?.backTo;

  return (
    <Flex
      bg="white"
      direction="column"
      minH="100vh"
      pb={{ base: "72px", md: "127px" }}
      pt={{ base: 6, md: 10 }}
    >
      <Flex
        direction="column"
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        w="full"
      >
        <VStack align="flex-start" gap={{ base: 8, md: 16 }} w="full">
          <VStack align="flex-start" gap={4} w="full">
            <BackButton
              label="목록으로"
              onClick={() => navigate(backTo ?? getUserEntryRoutePath(role))}
            />

            {isLoading ? (
              <Flex align="center" justify="center" minH={60} w="full">
                <Spinner color="seed" size="lg" />
              </Flex>
            ) : isError ? (
              <Flex align="center" justify="center" minH={60} w="full">
                <Text color="neutral.600">
                  프로젝트 정보를 불러오지 못했습니다.
                </Text>
              </Flex>
            ) : project ? (
              <ProjectDetailHeaderSection project={project} />
            ) : (
              <Flex align="center" justify="center" minH={60} w="full">
                <Text color="neutral.600">프로젝트 정보가 없습니다.</Text>
              </Flex>
            )}
          </VStack>

          {!isLoading && !isError && project && (
            <ProjectDetailSection project={project} />
          )}
        </VStack>
      </Flex>
    </Flex>
  );
}
