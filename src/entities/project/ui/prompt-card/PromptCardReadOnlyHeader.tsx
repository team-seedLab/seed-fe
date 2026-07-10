import { Flex, Text } from "@chakra-ui/react";

import { DocumentTextIcon } from "@/shared";

import { PromptCardCopyButton } from "./PromptCardCopyButton";

type Props = {
  copied: boolean;
  label: string;
  onCopy: () => void;
};

export const PromptCardReadOnlyHeader = ({ copied, label, onCopy }: Props) => {
  return (
    <Flex
      align={{ base: "flex-start", md: "center" }}
      borderBottom="1px solid"
      borderBottomColor="neutral.50"
      justify="space-between"
      pb={{ base: 3, md: "17px" }}
      pt={{ base: 3, md: "16px" }}
      px={{ base: 4, md: 6 }}
    >
      <Flex align="center" flexWrap="wrap" gap={2}>
        <DocumentTextIcon boxSize={3} color="neutral.600" />
        <Text
          color="neutral.600"
          fontSize={{ base: "2xs", md: "xs" }}
          fontWeight="medium"
        >
          {label}
        </Text>
      </Flex>

      <PromptCardCopyButton copied={copied} onCopy={onCopy} />
    </Flex>
  );
};
