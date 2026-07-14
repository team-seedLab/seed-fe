import { Navigate, useParams, useSearchParams } from "react-router";

import { Flex } from "@chakra-ui/react";

import {
  UploadStepWorkspaceSection,
  useUploadStepRouteGuard,
} from "@/features";

export default function UploadStepPage() {
  const [searchParams] = useSearchParams();
  const { projectId, step } = useParams<{
    projectId: string;
    step: string;
  }>();
  const stepNum = Number(step);
  const shouldResume = searchParams.get("resume") === "true";
  const { isReady, redirectTo } = useUploadStepRouteGuard({
    projectId,
    shouldResume,
    stepNum,
  });

  if (redirectTo) {
    return <Navigate replace to={redirectTo} />;
  }

  if (!projectId || !isReady) {
    return null;
  }

  return (
    <Flex bg="white" direction="column" minH="calc(100dvh - 60px)">
      <UploadStepWorkspaceSection projectId={projectId} stepNum={stepNum} />
    </Flex>
  );
}
