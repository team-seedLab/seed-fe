import { useState } from "react";

import { useMediaQuery } from "@chakra-ui/react";

const SPLIT_AI_MENTOR_LAYOUT_QUERY = "(min-width: 1200px)";
const DEFAULT_OPEN_AI_MENTOR_LAYOUT_QUERY = "(min-width: 1800px)";

export const useUploadAiMentorPanel = () => {
  const [isSplitScreen, isDefaultOpenScreen] = useMediaQuery([
    SPLIT_AI_MENTOR_LAYOUT_QUERY,
    DEFAULT_OPEN_AI_MENTOR_LAYOUT_QUERY,
  ]);
  const [openPreference, setOpenPreference] = useState<boolean | null>(null);
  const isOpen = openPreference ?? isDefaultOpenScreen;

  return {
    closePanel: () => setOpenPreference(false),
    isOpen,
    isSplitScreen,
    openPanel: () => setOpenPreference(true),
  };
};
