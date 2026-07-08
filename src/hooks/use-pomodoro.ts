"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { timerDurations, sessionsBeforeLongBreak } from "@/config/timer";
import { logStudySession } from "@/lib/actions/study-sessions";

type SessionType = "pomodoro" | "short_break" | "long_break";

export function usePomodoro(subjectId: string | null) {
  const [sessionType, setSessionType] = useState<SessionType>("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState(timerDurations.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchSession = useCallback(
    (nextType: SessionType, autoStart = false) => {
      setSessionType(nextType);
      setSecondsLeft(timerDurations[nextType]);
      setIsRunning(autoStart);
    },
    []
  );

  const handleComplete = useCallback(() => {
    const durationMinutes = timerDurations[sessionType] / 60;
    logStudySession(durationMinutes, sessionType, subjectId);

    if (sessionType === "pomodoro") {
      const nextCount = completedPomodoros + 1;
      setCompletedPomodoros(nextCount);
      const nextType =
        nextCount % sessionsBeforeLongBreak === 0 ? "long_break" : "short_break";
      switchSession(nextType);
    } else {
      switchSession("pomodoro");
    }
  }, [sessionType, subjectId, completedPomodoros, switchSession]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, handleComplete]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => switchSession(sessionType);
  const skip = () => handleComplete();

  return {
    sessionType,
    secondsLeft,
    isRunning,
    completedPomodoros,
    start,
    pause,
    reset,
    skip,
    switchSession,
  };
}