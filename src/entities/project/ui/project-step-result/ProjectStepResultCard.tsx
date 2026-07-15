import { Flex, Text, VStack } from "@chakra-ui/react";

import { ProjectContentCopyButton } from "../ProjectContentCopyButton";

import { ProjectStepResultContent } from "./ProjectStepResultContent";
import { ProjectStepResultEditor } from "./ProjectStepResultEditor";

type EditableProps = {
  content: string;
  mode: "editable";
  onContentChange: (content: string) => void;
};

type ReadOnlyProps = {
  content: string;
  mode?: "readonly";
  copied?: boolean;
  onCopy: () => void;
};

type Props = EditableProps | ReadOnlyProps;

export const ProjectStepResultCard = (props: Props) => {
  const isEditable = props.mode === "editable";

  return (
    <VStack align="flex-start" gap={{ base: 4, md: 6 }} w="full">
      <Flex align="center" justify="space-between" w="full">
        <Text
          as="h2"
          color="neutral.900"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          lineHeight="1.4"
        >
          {isEditable ? "학습 결과 입력" : "학습 결과"}
        </Text>

        {!isEditable && Boolean(props.content.trim()) && (
          <ProjectContentCopyButton
            copied={props.copied ?? false}
            onCopy={props.onCopy}
          />
        )}
      </Flex>

      {isEditable ? (
        <ProjectStepResultEditor
          content={props.content}
          onContentChange={props.onContentChange}
        />
      ) : (
        <ProjectStepResultContent
          content={props.content}
          emptyMessage="등록된 학습 결과가 없습니다."
        />
      )}
    </VStack>
  );
};
