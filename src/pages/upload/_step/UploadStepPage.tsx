import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

import { Flex } from "@chakra-ui/react";

import { UploadStepContentSection, UploadStepHeaderSection } from "@/features";
import { ROUTE_PATHS } from "@/shared";

export default function UploadStepPage() {
  const navigate = useNavigate();
  const { projectId, step } = useParams<{
    projectId: string;
    step: string;
  }>();
  const stepNum = parseInt(step ?? "1", 10);
  const isInvalidRoute = !projectId || isNaN(stepNum) || stepNum < 1;
  const resolvedProjectId = projectId ?? "";
  const resolvedStepNum = isNaN(stepNum) ? 1 : stepNum;

  useEffect(() => {
    if (isInvalidRoute) {
      navigate(ROUTE_PATHS.FILE_UPLOAD, { replace: true });
    }
  }, [isInvalidRoute, navigate]);

  if (isInvalidRoute) {
    return null;
  }

  return (
    <Flex bg="white" direction="column" minH="100vh" pb="127px" pt="80px">
      <Flex direction="column" gap={10} mx="auto" px={6} w="full" maxW="896px">
        <UploadStepHeaderSection
          projectId={resolvedProjectId}
          stepNum={resolvedStepNum}
        />

        <UploadStepContentSection
          projectId={resolvedProjectId}
          stepNum={resolvedStepNum}
        />
      </Flex>
    </Flex>
  );
}
