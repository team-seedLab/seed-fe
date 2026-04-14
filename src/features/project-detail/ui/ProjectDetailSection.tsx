import { useState } from "react";

import { Text, VStack } from "@chakra-ui/react";

import { type ProjectDetailResponse, PromptCard } from "@/entities";

type Props = {
  project: ProjectDetailResponse;
};

export const ProjectDetailSection = ({ project }: Props) => {
  const stepResponses = project.stepResponses ?? [];
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMap((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setCopiedMap((prev) => ({ ...prev, [key]: false })),
        2000,
      );
    });
  };

  return (
    <VStack
      align="flex-start"
      bg="white"
      border="1px solid white"
      borderRadius={{ base: "3xl", md: "4xl" }}
      boxShadow="0px 20px 60px -10px rgba(0,0,0,0.08)"
      gap={{ base: 8, md: 12 }}
      overflow="hidden"
      p={{ base: 4, md: 12 }}
      w="full"
    >
      {stepResponses.map((step, i) => {
        const promptKey = `prompt-${step.stepCode}`;
        const resultKey = `result-${step.stepCode}`;

        return (
          <VStack
            align="flex-start"
            gap={{ base: 4, md: 6 }}
            key={step.stepCode}
            w="full"
          >
            <VStack align="flex-start" gap={{ base: 2, md: "10px" }} w="full">
              <Text color="seed" fontSize="xs" fontWeight="bold">
                Step {i + 1}
              </Text>
              <Text
                color="neutral.900"
                fontSize={{ base: "xl", md: "26px" }}
                fontWeight="bold"
                lineHeight="1.4"
              >
                {step.stepName}
              </Text>
            </VStack>

            <PromptCard
              content={step.providedPromptSnapshot}
              copied={copiedMap[promptKey]}
              label="생성된 프롬프트"
              onCopy={() => handleCopy(promptKey, step.providedPromptSnapshot)}
            />

            {step.userSubmittedResult && (
              <PromptCard
                content={step.userSubmittedResult}
                copied={copiedMap[resultKey]}
                label="작업 결과"
                onCopy={() => handleCopy(resultKey, step.userSubmittedResult!)}
              />
            )}
          </VStack>
        );
      })}
    </VStack>
  );
};
