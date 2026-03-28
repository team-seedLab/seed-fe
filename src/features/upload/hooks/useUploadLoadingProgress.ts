import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { useUploadFlowStore } from "@/entities";
import { DYNAMIC_ROUTE_PATHS, ROUTE_PATHS } from "@/shared";

const LOADING_STEPS = [
  { threshold: 0, message: "파일 업로드 중.." },
  { threshold: 20, message: "PDF 텍스트 추출 중.." },
  { threshold: 50, message: "과제 내용 분석 중.." },
  { threshold: 75, message: "로드맵 생성 중.." },
  { threshold: 95, message: "마무리 중.." },
];

type Result = {
  progress: number;
  currentStepMessage: string;
};

export const useUploadLoadingProgress = (): Result => {
  const navigate = useNavigate();
  const [timerProgress, setTimerProgress] = useState(0);

  const projectId = useUploadFlowStore((state) => state.projectId);
  const error = useUploadFlowStore((state) => state.error);

  const progress = projectId ? 100 : timerProgress;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }

        const increment = prev < 70 ? 1.2 : 0.6;
        return Math.min(prev + increment, 90);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (error) {
      navigate(ROUTE_PATHS.FILE_UPLOAD);
    }
  }, [error, navigate]);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const timer = setTimeout(() => {
      navigate(DYNAMIC_ROUTE_PATHS.UPLOAD_STEP(projectId, 1));
    }, 600);

    return () => clearTimeout(timer);
  }, [projectId, navigate]);

  const currentStepMessage = useMemo(() => {
    const currentStep =
      [...LOADING_STEPS].reverse().find((step) => progress >= step.threshold) ??
      LOADING_STEPS[0];

    return currentStep.message;
  }, [progress]);

  return {
    progress,
    currentStepMessage,
  };
};
