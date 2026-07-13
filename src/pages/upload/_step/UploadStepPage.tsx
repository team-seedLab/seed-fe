import { Navigate, useParams, useSearchParams } from "react-router";

import { Flex } from "@chakra-ui/react";

import {
  UploadStepContentSection,
  UploadStepHeaderSection,
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
    <Flex
      bg="white"
      direction="column"
      minH="100vh"
      pb={{ base: "72px", md: "127px" }}
      pt={{ base: "40px", md: "80px" }}
    >
      <Flex
        direction="column"
        gap={{ base: 6, md: 10 }}
        maxW="896px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        w="full"
      >
        <UploadStepHeaderSection projectId={projectId} stepNum={stepNum} />

        <UploadStepContentSection projectId={projectId} stepNum={stepNum} />
      </Flex>
    </Flex>
  );
}
