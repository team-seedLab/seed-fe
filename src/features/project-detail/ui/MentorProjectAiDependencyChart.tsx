import { ProgressCircle, Text, VStack } from "@chakra-ui/react";

type Props = {
  value: number;
};

export const MentorProjectAiDependencyChart = ({ value }: Props) => {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <ProgressCircle.Root flexShrink={0} value={normalizedValue}>
      <ProgressCircle.Circle
        aria-label="AI 의존도"
        aria-valuetext={`${normalizedValue}%`}
        css={{
          "--size": "clamp(144px, 20vw, 200px)",
          "--thickness": "clamp(14px, 2vw, 20px)",
        }}
      >
        <ProgressCircle.Track stroke="neutral.100" />
        <ProgressCircle.Range stroke="seed.600" />
      </ProgressCircle.Circle>

      <VStack inset={0} justify="center" position="absolute" gap={1}>
        <Text color="neutral.700" fontSize="xs" fontWeight="semibold">
          AI 의존도
        </Text>
        <Text
          color="neutral.900"
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          lineHeight="1.2"
        >
          {normalizedValue}%
        </Text>
      </VStack>
    </ProgressCircle.Root>
  );
};
