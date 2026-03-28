import { UploadLoadingSection, useUploadLoadingProgress } from "@/features";

export default function UploadLoadingPage() {
  const { progress, currentStepMessage } = useUploadLoadingProgress();

  return (
    <UploadLoadingSection
      currentStepMessage={currentStepMessage}
      progress={progress}
    />
  );
}
