import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useUploadFlowStore } from "@/entities";
import { DYNAMIC_ROUTE_PATHS, ROUTE_PATHS } from "@/shared";

const MAX_TIMER_PROGRESS = 90;
const PROGRESS_SLOWDOWN_THRESHOLD = 70;
const FAST_PROGRESS_INCREMENT = 1.2;
const SLOW_PROGRESS_INCREMENT = 0.6;
const PROGRESS_INTERVAL_MS = 80;
const STEP_REDIRECT_DELAY_MS = 600;

const LOADING_STEPS = [
  { threshold: 95, message: "마무리 중.." },
  { threshold: 75, message: "로드맵 생성 중.." },
  { threshold: 50, message: "과제 내용 분석 중.." },
  { threshold: 20, message: "파일 텍스트 추출 중.." },
  { threshold: 0, message: "파일 업로드 중.." },
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
    if (projectId) {
      return;
    }

    const interval = setInterval(() => {
      setTimerProgress((prev) => {
        if (prev >= MAX_TIMER_PROGRESS) {
          clearInterval(interval);
          return MAX_TIMER_PROGRESS;
        }

        const increment =
          prev < PROGRESS_SLOWDOWN_THRESHOLD
            ? FAST_PROGRESS_INCREMENT
            : SLOW_PROGRESS_INCREMENT;

        return Math.min(prev + increment, MAX_TIMER_PROGRESS);
      });
    }, PROGRESS_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [projectId]);

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
    }, STEP_REDIRECT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [projectId, navigate]);

  const currentStepMessage =
    LOADING_STEPS.find((step) => progress >= step.threshold)?.message ??
    LOADING_STEPS[LOADING_STEPS.length - 1].message;

  return {
    progress,
    currentStepMessage,
  };
};
