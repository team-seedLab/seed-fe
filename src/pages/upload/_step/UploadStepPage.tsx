import { Navigate, useParams } from "react-router";

import { Flex } from "@chakra-ui/react";

import { UploadStepContentSection, UploadStepHeaderSection } from "@/features";
import { ROUTE_PATHS } from "@/shared";

export default function UploadStepPage() {
  const { projectId, step } = useParams<{
    projectId: string;
    step: string;
  }>();
  const stepNum = Number(step);
  const isInvalidRoute = !projectId || isNaN(stepNum) || stepNum < 1;

  if (isInvalidRoute) {
    return <Navigate replace to={ROUTE_PATHS.FILE_UPLOAD} />;
  }

  return (
    <Flex bg="white" direction="column" minH="100vh" pb="127px" pt="80px">
      <Flex direction="column" gap={10} mx="auto" px={6} w="full" maxW="896px">
        <UploadStepHeaderSection projectId={projectId} stepNum={stepNum} />

        <UploadStepContentSection projectId={projectId} stepNum={stepNum} />
      </Flex>
    </Flex>
  );
}
