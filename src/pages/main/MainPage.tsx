import { useState } from "react";

import { Flex } from "@chakra-ui/react";

import {
  AssignmentHelpSection,
  ExecutionOnlySection,
  MainHeroCaptureSection,
  PromptNoHesitationSection,
  WhatToDoSection,
} from "@/features";

export default function MainPage() {
  const [isSolutionSectionReady, setIsSolutionSectionReady] = useState(false);

  return (
    <Flex>
      <MainHeroCaptureSection />
      <AssignmentHelpSection
        onSolutionReadyChange={setIsSolutionSectionReady}
      />
      <ExecutionOnlySection isActivated={isSolutionSectionReady} />
      <PromptNoHesitationSection />
      <WhatToDoSection />
    </Flex>
  );
}
