import { useLocation, useNavigate, useParams } from "react-router";

import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";

import {
  getUserEntryRoutePath,
  useGetMentorProjectDetail,
  useGetProjectDetail,
  useUserInfoStore,
} from "@/entities";
import {
  MentorProjectDetailSection,
  ProjectDetailHeaderSection,
  ProjectDetailSection,
  getMentorProjectDetailErrorMessage,
} from "@/features";
import { BackButton } from "@/shared";

type ProjectDetailLocationState = {
  backTo?: string;
};

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const role = useUserInfoStore((state) => {
    return state.userInfo?.role ?? state.persistedProfile?.role;
  });
  const isMentor = role === "MENTOR";
  const menteeProjectQuery = useGetProjectDetail(projectId ?? "", !isMentor);
  const mentorProjectQuery = useGetMentorProjectDetail(
    projectId ?? "",
    isMentor,
  );
  const project = isMentor ? mentorProjectQuery.data : menteeProjectQuery.data;
  const isError = isMentor
    ? mentorProjectQuery.isError
    : menteeProjectQuery.isError;
  const isLoading = isMentor
    ? mentorProjectQuery.isLoading
    : menteeProjectQuery.isLoading;
  const error = isMentor ? mentorProjectQuery.error : menteeProjectQuery.error;
  const backTo = (location.state as ProjectDetailLocationState | null)?.backTo;
  const errorMessage = isMentor
    ? getMentorProjectDetailErrorMessage(error)
    : "프로젝트 정보를 불러오지 못했습니다.";

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
                <Text color="neutral.600">{errorMessage}</Text>
              </Flex>
            ) : project ? (
              <ProjectDetailHeaderSection project={project} />
            ) : (
              <Flex align="center" justify="center" minH={60} w="full">
                <Text color="neutral.600">프로젝트 정보가 없습니다.</Text>
              </Flex>
            )}
          </VStack>

          {!isLoading && !isError && isMentor && mentorProjectQuery.data && (
            <MentorProjectDetailSection project={mentorProjectQuery.data} />
          )}
          {!isLoading && !isError && !isMentor && menteeProjectQuery.data && (
            <ProjectDetailSection project={menteeProjectQuery.data} />
          )}
        </VStack>
      </Flex>
    </Flex>
  );
}
