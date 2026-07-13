import { Navigate, useParams, useSearchParams } from "react-router";

import { Flex } from "@chakra-ui/react";

import {
  UploadStepContentSection,
  UploadStepHeaderSection,
  useUploadStepProject,
  useUploadStepResumeRedirect,
} from "@/features";
import { DYNAMIC_ROUTE_PATHS, ROUTE_PATHS } from "@/shared";

export default function UploadStepPage() {
  const [searchParams] = useSearchParams();
  const { projectId, step } = useParams<{
    projectId: string;
    step: string;
  }>();
  const stepNum = Number(step);
  const isValidStepNum = Number.isInteger(stepNum) && stepNum > 0;
  const { progressStep, project, selectableStepCodes, stepCode, steps } =
    useUploadStepProject({
      projectId: projectId ?? "",
      stepNum,
    });
  const isStepOutOfRange = steps.length > 0 && stepNum > steps.length;
  const isStepUnavailable =
    stepCode !== undefined && !selectableStepCodes.includes(stepCode);
  const shouldResume = searchParams.get("resume") === "true";
  const { isResolved } = useUploadStepResumeRedirect({
    projectId: projectId ?? "",
    stepNum,
    enabled: Boolean(projectId) && isValidStepNum && shouldResume,
  });

  if (!projectId || !isValidStepNum || isStepOutOfRange) {
    return <Navigate replace to={ROUTE_PATHS.FILE_UPLOAD} />;
  }

  if (project?.status === "COMPLETED") {
    return (
      <Navigate replace to={DYNAMIC_ROUTE_PATHS.PROJECT_DETAIL(projectId)} />
    );
  }

  if (isStepUnavailable && progressStep !== null) {
    return (
      <Navigate
        replace
        to={DYNAMIC_ROUTE_PATHS.UPLOAD_STEP(projectId, progressStep)}
      />
    );
  }

  if (shouldResume && !isResolved) {
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
