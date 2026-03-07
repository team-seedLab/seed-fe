import type { MainStorySequenceProps } from "../../components/features/mainStory/MainStorySequence";
import { MainStorySequence } from "../../components/features/mainStory/MainStorySequence";

export const MainStorySection = (props: MainStorySequenceProps) => {
  return <MainStorySequence {...props} />;
};
