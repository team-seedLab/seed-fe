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
    <Flex
      bg="white"
      direction="column"
      minH="100vh"
      pb={{ base: "72px", md: "127px" }}
      pt={{ base: 6, md: "80px" }}
    >
      <Flex
        direction="column"
        gap={{ base: 6, md: 10 }}
        maxW="896px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        w="full"
      >
        <VStack align="flex-start" gap={{ base: 4, md: 6 }}>
          <Button
            alignSelf="flex-start"
            color="neutral.600"
            fontSize={{ base: "xs", md: "sm" }}
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
              <VStack align="flex-start" gap={{ base: 1.5, md: 2 }}>
                <Box
                  bg="neutral.50"
                  border="1px solid white"
                  borderRadius="md"
                  color="neutral.600"
                  fontSize={{ base: "2xs", md: "10px" }}
                  fontWeight="regular"
                  px={{ base: 2, md: "9px" }}
                  py={{ base: 1, md: "5px" }}
                >
                  {ROADMAP_TYPE_LABEL[project.roadmapType] ??
                    project.roadmapType}
                </Box>
                <Text
                  color="neutral.900"
                  fontSize={{ base: "2xl", md: "3xl" }}
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
