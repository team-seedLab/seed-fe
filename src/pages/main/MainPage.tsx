import { useState } from "react";

import {
  AssignmentHelpSection,
  ExecutionOnlySection,
  MainHeroCaptureSection,
  PromptNoHesitationSection,
  WhatToDoSection,
} from "@/features/main";

export default function MainPage() {
  const [isSolutionSectionReady, setIsSolutionSectionReady] = useState(false);

  return (
    <>
      <MainHeroCaptureSection />
      <AssignmentHelpSection
        onSolutionReadyChange={setIsSolutionSectionReady}
      />
      <ExecutionOnlySection isActivated={isSolutionSectionReady} />
      <PromptNoHesitationSection />
      <WhatToDoSection />
    </>
  );
}
