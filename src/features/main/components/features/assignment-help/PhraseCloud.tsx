import { useRef } from "react";

import { Box, Text } from "@chakra-ui/react";

import {
  PHRASE_CLOUD_BASE_TONE,
  PHRASE_CLOUD_PHRASES,
} from "../../../constants";
import { usePhraseCloudMotion } from "../../../hooks";

type PhraseCloudProps = {
  backdropOpacity: number;
  interactive: boolean;
  phraseOpacity: number;
};

export const PhraseCloud = ({
  backdropOpacity,
  interactive,
  phraseOpacity,
}: PhraseCloudProps) => {
  const phraseCloudContainerRef = useRef<HTMLDivElement | null>(null);
  const { baseOpacity, handlePointerLeave, handlePointerMove, phraseRefs } =
    usePhraseCloudMotion({
      containerRef: phraseCloudContainerRef,
      interactive,
    });

  return (
    <Box
      inset={0}
      pointerEvents={interactive ? "auto" : "none"}
      position="absolute"
      zIndex={3}
    >
      <Box
        boxSize="full"
        left={0}
        opacity={backdropOpacity}
        overflow="hidden"
        position="absolute"
        top={0}
        transition="opacity 260ms ease"
        zIndex={1}
      >
        <Box
          boxSize="full"
          opacity={phraseOpacity}
          transition="opacity 220ms ease"
        >
          <Box
            boxSize="full"
            onPointerLeave={interactive ? handlePointerLeave : undefined}
            onPointerMove={interactive ? handlePointerMove : undefined}
            overflow="hidden"
            pointerEvents={interactive ? "auto" : "none"}
            position="relative"
            ref={phraseCloudContainerRef}
            style={{ contain: "layout paint style" }}
          >
            {PHRASE_CLOUD_PHRASES.map((phrase, index) => (
              <Text
                as="p"
                color={`rgb(${PHRASE_CLOUD_BASE_TONE}, ${PHRASE_CLOUD_BASE_TONE}, ${PHRASE_CLOUD_BASE_TONE})`}
                fontSize={{
                  base: "lg",
                  md: "2xl",
                  lg: "3xl",
                  xl: "4xl",
                }}
                fontWeight="bold"
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
        </Box>
      </Box>
    </Box>
  );
};
