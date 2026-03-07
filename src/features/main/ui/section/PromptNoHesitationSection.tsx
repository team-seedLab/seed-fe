import { Box, Flex, VStack } from "@chakra-ui/react";

import { ActionableOutputPanel } from "../../components/features/promptNoHesitation/ActionableOutputPanel";
import { PromptPreviewCard } from "../../components/features/promptNoHesitation/PromptPreviewCard";

export const PromptNoHesitationSection = () => {
  return (
    <Box bg="white" py={{ base: 16, md: 20, lg: 24 }} w="full">
      <VStack
        align="stretch"
        gap={12}
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 8, lg: 0 }}
        w="full"
      >
        <VStack align="start" gap={3} maxW="779px" w="full">
          <Box
            as="h2"
            color="#0A0A0A"
            fontSize={{ base: "32px", lg: "48px" }}
            fontWeight={700}
            letterSpacing="-0.02em"
            lineHeight="1.4"
          >
            ?꾨＼?꾪듃 李??욎뿉??留앹꽕?댁? 留덉꽭??
            <br />
            ?뺣떟? ?대? SEED???덉뒿?덈떎.
          </Box>
          <Box
            as="p"
            color="#525252"
            fontSize={{ base: "16px", lg: "20px" }}
            fontWeight={500}
            letterSpacing="-0.02em"
            lineHeight="1.4"
            maxW="779px"
          >
            ?섎쭖? 耳?댁뒪???깃났?곸씤 ?꾨＼?꾪듃 ?곗씠?곕? ?숈뒿??寃곌낵?
            怨쇱젣臾쇱쓽 遺꾩꽍???듯빐
            <br />
            媛?濡쒕뱶留듭뿉 理쒖쟻?붾맂 ?꾨＼?꾪듃瑜??쒓났?⑸땲??
          </Box>
        </VStack>

        <Flex
          align={{ base: "stretch", xl: "center" }}
          direction={{ base: "column", xl: "row" }}
          gap={{ base: 10, xl: 16 }}
          px={{ base: 0, lg: 6 }}
          py={{ base: 0, lg: 6 }}
          w="full"
        >
          <Box flex="1 1 0" minW={0}>
            <PromptPreviewCard />
          </Box>
          <ActionableOutputPanel />
        </Flex>
      </VStack>
    </Box>
  );
};
