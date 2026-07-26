import { useState } from "react";

import { Button } from "@chakra-ui/react";

import {
  type MentorProjectReviewStatus,
  useCompleteMentorProjectReview,
} from "@/entities";
import { ConfirmDialog } from "@/shared";

type Props = {
  projectId: string;
  status: MentorProjectReviewStatus;
};

export const MentorProjectReviewAction = ({ projectId, status }: Props) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { isPending, mutate: completeReview } =
    useCompleteMentorProjectReview(projectId);
  const isReviewed = status === "REVIEWED";

  return (
    <>
      <Button
        bg={isReviewed ? "neutral.100" : "seed"}
        borderRadius="xl"
        color={isReviewed ? "neutral.600" : "white"}
        disabled={isReviewed || isPending}
        fontSize="sm"
        fontWeight="bold"
        minH={10}
        px={5}
        _disabled={{ cursor: "default", opacity: isReviewed ? 1 : 0.5 }}
        _hover={{ bg: isReviewed ? "neutral.100" : "seed.hover" }}
        onClick={() => setIsConfirmOpen(true)}
      >
        {isReviewed ? "검토 완료됨" : isPending ? "처리 중" : "검토 완료"}
      </Button>

      {!isReviewed && (
        <ConfirmDialog
          confirmLabel="검토 완료"
          description="검토를 완료하면 현재 상태로 다시 되돌릴 수 없습니다. 검토를 완료할까요?"
          open={isConfirmOpen}
          title="프로젝트 검토 완료"
          onConfirm={completeReview}
          onOpenChange={setIsConfirmOpen}
        />
      )}
    </>
  );
};
