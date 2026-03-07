import { useState } from "react";

import {
  ExecutionOnlySection,
  MainStorySection,
  PromptNoHesitationSection,
  WhatToDoSection,
} from "@/features/main";

export default function MainPage() {
  const [isSolutionSectionReady, setIsSolutionSectionReady] = useState(false);

  return (
    <>
      <MainStorySection onSolutionReadyChange={setIsSolutionSectionReady} />
      <ExecutionOnlySection isActivated={isSolutionSectionReady} />
      <PromptNoHesitationSection />
      <WhatToDoSection />
    </>
  );
}
