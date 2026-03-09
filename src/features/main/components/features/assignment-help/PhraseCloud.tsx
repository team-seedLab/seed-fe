import { useRef } from "react";

import { Box, Text } from "@chakra-ui/react";

import {
  TIME_LOSS_PHRASES,
  TIME_LOSS_PHRASE_BASE_TONE,
} from "../../../constants";
import { useTimeLossPhraseMotion } from "../../../hooks";

type TimeLossPhraseCloudProps = {
  backdropOpacity: number;
  interactive: boolean;
  phraseOpacity: number;
};

export const PhraseCloud = ({
  backdropOpacity,
  interactive,
  phraseOpacity,
}: TimeLossPhraseCloudProps) => {
  const timeLossPhraseContainerRef = useRef<HTMLDivElement | null>(null);
  const { baseOpacity, handlePointerLeave, handlePointerMove, phraseRefs } =
    useTimeLossPhraseMotion({
      containerRef: timeLossPhraseContainerRef,
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
        h="full"
        left={0}
        opacity={backdropOpacity}
        overflow="hidden"
        position="absolute"
        top={0}
        transition="opacity 260ms ease"
        w="full"
        zIndex={1}
      >
        <Box
          h="full"
          opacity={phraseOpacity}
          transition="opacity 220ms ease"
          w="full"
        >
          <Box
            h="full"
            onPointerLeave={interactive ? handlePointerLeave : undefined}
            onPointerMove={interactive ? handlePointerMove : undefined}
            overflow="hidden"
            pointerEvents={interactive ? "auto" : "none"}
            position="relative"
            ref={timeLossPhraseContainerRef}
            style={{ contain: "layout paint style" }}
            w="full"
          >
            {TIME_LOSS_PHRASES.map((phrase, index) => (
              <Text
                as="p"
                color={`rgb(${TIME_LOSS_PHRASE_BASE_TONE}, ${TIME_LOSS_PHRASE_BASE_TONE}, ${TIME_LOSS_PHRASE_BASE_TONE})`}
                fontSize={{
                  base: "lg",
                  md: "2xl",
                  lg: "3xl",
                  xl: "4xl",
                }}
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
        </Box>
      </Box>
    </Box>
  );
};
