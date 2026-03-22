import { useNavigate, useParams } from "react-router";

import { Box, Button, Flex, Spinner, Text, VStack } from "@chakra-ui/react";

import { ROADMAP_TYPE_LABEL, useGetProjectDetail } from "@/entities";
import { ProjectDetailSection } from "@/features";
import { ArrowLeftIcon, ROUTE_PATHS } from "@/shared";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useGetProjectDetail(projectId ?? "");

  return (
    <Flex bg="white" direction="column" minH="100vh" pb="127px" pt="80px">
      <Flex direction="column" gap={10} mx="auto" px={6} w="full" maxW="896px">
        <VStack align="flex-start" gap={6}>
          <Button
            alignSelf="flex-start"
            color="neutral.600"
            fontSize="sm"
            fontWeight="medium"
            gap={1}
            onClick={() => navigate(ROUTE_PATHS.MYPAGE)}
            px={0}
            variant="ghost"
            _hover={{ color: "neutral.900" }}
          >
            <ArrowLeftIcon boxSize={3} />
            목록으로
          </Button>

          {isLoading ? (
            <Flex align="center" justify="center" w="full" py={20}>
              <Spinner color="seed" size="lg" />
            </Flex>
          ) : project ? (
            <>
              <VStack align="flex-start" gap={2}>
                <Box
                  bg="neutral.50"
                  border="1px solid white"
                  borderRadius="md"
                  color="neutral.600"
                  fontSize="10px"
                  fontWeight="regular"
                  px="9px"
                  py="5px"
                >
                  {ROADMAP_TYPE_LABEL[project.roadmapType] ??
                    project.roadmapType}
                </Box>
                <Text
                  color="neutral.900"
                  fontSize="3xl"
                  fontWeight="bold"
                  lineHeight="1.4"
                >
                  {project.title}
                </Text>
              </VStack>

              <ProjectDetailSection project={project} />
            </>
          ) : null}
        </VStack>
      </Flex>
    </Flex>
  );
}
