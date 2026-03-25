import { Navigate, useParams, useSearchParams } from "react-router";

import { Flex } from "@chakra-ui/react";

import {
  UploadStepContentSection,
  UploadStepHeaderSection,
  useUploadStepResumeGuard,
} from "@/features";
import { ROUTE_PATHS } from "@/shared";

export default function UploadStepPage() {
  const [searchParams] = useSearchParams();
  const { projectId, step } = useParams<{
    projectId: string;
    step: string;
  }>();
  const stepNum = Number(step);
  const isInvalidRoute = !projectId || isNaN(stepNum) || stepNum < 1;
  const shouldResume = searchParams.get("resume") === "true";
  const { isResolved } = useUploadStepResumeGuard({
    projectId: !isInvalidRoute && shouldResume ? projectId : undefined,
    stepNum,
  });

  if (isInvalidRoute) {
    return <Navigate replace to={ROUTE_PATHS.FILE_UPLOAD} />;
  }

  if (shouldResume && !isResolved) {
    return null;
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
