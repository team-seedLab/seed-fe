import { useState } from "react";

import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";

import type { MentorProjectReviewStatus } from "@/entities";
import { ConfirmDialog } from "@/shared";

import { formatProjectDetailDate } from "../utils";

type Props = {
  isCompleting: boolean;
  reviewedAt: string | null;
  status: MentorProjectReviewStatus;
  onComplete: () => void;
};

const getReviewDescription = (
  isReviewed: boolean,
  reviewedAt: string | null,
) => {
  if (!isReviewed) {
    return "프로젝트 기록을 확인한 뒤 검토를 완료해 주세요.";
  }

  if (!reviewedAt) {
    return "프로젝트 검토가 완료되었습니다.";
  }

  return `${formatProjectDetailDate(reviewedAt)}에 검토했습니다.`;
};

export const MentorProjectReviewSection = ({
  isCompleting,
  reviewedAt,
  status,
  onComplete,
}: Props) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isReviewed = status === "REVIEWED";
  const reviewDescription = getReviewDescription(isReviewed, reviewedAt);

  return (
    <>
      <Flex
        align={{ base: "stretch", md: "center" }}
        bg="neutral.50"
        border="1px solid"
        borderColor="neutral.100"
        borderRadius="xl"
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 6 }}
        justify="space-between"
        p={{ base: 4, md: 5 }}
        w="full"
      >
        <VStack align="flex-start" gap={2}>
          <Text color="neutral.600" fontSize="xs" fontWeight="bold">
            멘토 검토 상태
          </Text>
          <Flex align="center" gap={2}>
            <Box
              bg={isReviewed ? "seed" : "neutral.400"}
              borderRadius="full"
              boxSize={2}
            />
            <Text color="neutral.900" fontSize="md" fontWeight="bold">
              {isReviewed ? "검토 완료" : "검토 중"}
            </Text>
          </Flex>
          <Text color="neutral.600" fontSize="xs">
            {reviewDescription}
          </Text>
        </VStack>

        {!isReviewed && (
          <Button
            bg="seed"
            borderRadius="xl"
            color="white"
            disabled={isCompleting}
            fontSize="sm"
            fontWeight="bold"
            minH={10}
            px={5}
            w={{ base: "full", md: "auto" }}
            _disabled={{ opacity: 0.5 }}
            _hover={{ bg: "seed.hover" }}
            onClick={() => setIsConfirmOpen(true)}
          >
            {isCompleting ? "처리 중" : "검토 완료"}
          </Button>
        )}
      </Flex>

      <ConfirmDialog
        confirmLabel="검토 완료"
        description="검토를 완료하면 현재 상태로 다시 되돌릴 수 없습니다. 검토를 완료할까요?"
        open={isConfirmOpen}
        title="프로젝트 검토 완료"
        onConfirm={onComplete}
        onOpenChange={setIsConfirmOpen}
      />
    </>
  );
};
