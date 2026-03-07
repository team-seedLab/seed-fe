import { useRef } from "react";

import { Box, Text } from "@chakra-ui/react";

import {
  PROBLEM_DEFINITION_NEXT_PHRASES,
  PROBLEM_DEFINITION_NEXT_PHRASE_BASE_TONE,
} from "../../../constants/problemDefinitionNextPhraseData";
import { useProblemDefinitionNextPhraseMotion } from "../../../hooks/useProblemDefinitionNextPhraseMotion";

type ProblemDefinitionNextPhraseCloudProps = {
  interactive: boolean;
};

export const ProblemDefinitionNextPhraseCloud = ({
  interactive,
}: ProblemDefinitionNextPhraseCloudProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { baseOpacity, handlePointerLeave, handlePointerMove, phraseRefs } =
    useProblemDefinitionNextPhraseMotion({
      containerRef,
      interactive,
    });

  return (
    <Box
      h="full"
      onPointerLeave={interactive ? handlePointerLeave : undefined}
      onPointerMove={interactive ? handlePointerMove : undefined}
      overflow="hidden"
      pointerEvents={interactive ? "auto" : "none"}
      position="relative"
      ref={containerRef}
      style={{ contain: "layout paint style" }}
      w="full"
    >
      {PROBLEM_DEFINITION_NEXT_PHRASES.map((phrase, index) => (
        <Text
          as="p"
          color={`rgb(${PROBLEM_DEFINITION_NEXT_PHRASE_BASE_TONE}, ${PROBLEM_DEFINITION_NEXT_PHRASE_BASE_TONE}, ${PROBLEM_DEFINITION_NEXT_PHRASE_BASE_TONE})`}
          fontSize={{ base: "18px", md: "22px", lg: "26px", xl: "30px" }}
          fontWeight={700}
          key={`${phrase.text}-${index}`}
          left="50%"
          letterSpacing="-0.02em"
          lineHeight="1.4"
          pointerEvents="none"
          position="absolute"
          ref={(el) => {
            phraseRefs.current[index] = el;
          }}
          style={{
            opacity: baseOpacity,
            transform: "translate3d(-50%, -50%, 0) scale(1)",
            transition: "none",
            willChange: "transform, opacity, left, top",
          }}
          top="50%"
          userSelect="none"
          whiteSpace="nowrap"
        >
          {phrase.text}
        </Text>
      ))}
    </Box>
  );
};
