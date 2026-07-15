import { Button, Flex, Text } from "@chakra-ui/react";

import { CopyIcon } from "@/shared";

type Props = {
  copied: boolean;
  rounded?: boolean;
  onCopy: () => void;
};

export const ProjectContentCopyButton = ({
  copied,
  rounded = false,
  onCopy,
}: Props) => {
  return (
    <Button
      bg="white"
      border="1px solid"
      borderColor="neutral.50"
      borderRadius={rounded ? "full" : "lg"}
      boxShadow="0px 1px 2px 0px rgba(0,0,0,0.05)"
      cursor="pointer"
      h={8}
      onClick={onCopy}
      px={{ base: 3, md: "13px" }}
      type="button"
      variant="ghost"
      _hover={{ boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.08)" }}
    >
      <Flex align="center" gap={{ base: 1.5, md: "6px" }}>
        <CopyIcon boxSize={3} color={copied ? "seed" : "neutral.900"} />
        <Text
          color={copied ? "seed" : "neutral.900"}
          fontSize={{ base: "2xs", md: "xs" }}
          fontWeight="semibold"
          lineHeight="1.4"
        >
          {copied ? "복사됨 ✓" : "복사하기"}
        </Text>
      </Flex>
    </Button>
  );
};
