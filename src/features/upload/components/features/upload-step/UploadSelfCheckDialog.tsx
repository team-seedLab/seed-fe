import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Flex,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import type { ProjectStepSelfCheckItem } from "@/entities";
import { ArrowRightIcon } from "@/shared/_assets/icons";

import { UploadSelfCheckField } from "./UploadSelfCheckField";

type SelfCheckFieldItem = Omit<ProjectStepSelfCheckItem, "answer"> & {
  answer: string;
};

type Props = {
  checkItems: SelfCheckFieldItem[];
  isError: boolean;
  isLoading: boolean;
  isOpen: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  onAnswerChange: (key: string, answer: string) => void;
  onOpenChange: (open: boolean) => void;
  onRetry: () => void;
  onSubmit: () => void;
};

export const UploadSelfCheckDialog = ({
  checkItems,
  isError,
  isLoading,
  isOpen,
  isSubmitting,
  isValid,
  onAnswerChange,
  onOpenChange,
  onRetry,
  onSubmit,
}: Props) => {
  return (
    <DialogRoot
      closeOnEscape={!isSubmitting}
      closeOnInteractOutside={!isSubmitting}
      open={isOpen}
      placement="center"
      scrollBehavior="inside"
      onOpenChange={(event) => onOpenChange(event.open)}
    >
      <DialogBackdrop />
      <DialogPositioner px={4}>
        <DialogContent
          borderRadius="3xl"
          maxH="calc(100dvh - 32px)"
          maxW="600px"
          w="full"
        >
          <DialogHeader
            alignItems="flex-start"
            flexDirection="column"
            gap={2}
            px={{ base: 5, md: 6 }}
            pb={0}
            pt={{ base: 5, md: 6 }}
          >
            <DialogTitle color="neutral.900" fontSize="lg" fontWeight="bold">
              이해 확인 및 검증
            </DialogTitle>
            <DialogDescription color="neutral.600" fontSize="sm">
              다음 단계로 넘어가기 전, 이번 단계에서 학습한 내용을 스스로 정리해
              보세요.
            </DialogDescription>
          </DialogHeader>

          <DialogBody px={{ base: 5, md: 6 }} py={6}>
            {isLoading ? (
              <Flex align="center" justify="center" minH={40}>
                <Spinner color="seed" size="lg" />
              </Flex>
            ) : isError ? (
              <VStack gap={4} justify="center" minH={40}>
                <Text color="neutral.600" fontSize="sm">
                  Self-Check 내용을 불러오지 못했습니다.
                </Text>
                <Button borderRadius="xl" onClick={onRetry} variant="outline">
                  다시 시도
                </Button>
              </VStack>
            ) : (
              <VStack align="stretch" gap={6}>
                {checkItems.map(({ key, question, answer }) => (
                  <UploadSelfCheckField
                    answer={answer}
                    key={key}
                    question={question}
                    onChange={(value) => onAnswerChange(key, value)}
                  />
                ))}
              </VStack>
            )}
          </DialogBody>

          <DialogFooter px={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }} pt={0}>
            <Button
              bg="seed"
              borderRadius="xl"
              color="white"
              disabled={!isValid || isLoading || isError || isSubmitting}
              fontSize="md"
              fontWeight="bold"
              gap={1}
              onClick={onSubmit}
              px={10}
              py={4}
              _disabled={{ opacity: 0.5 }}
              _hover={{ opacity: isValid && !isSubmitting ? 0.85 : 0.5 }}
            >
              {isSubmitting ? "저장 중" : "검증완료"}
              <ArrowRightIcon boxSize={3} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};
