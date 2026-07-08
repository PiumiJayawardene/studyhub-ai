"use client";

import { usePomodoro } from "@/hooks/use-pomodoro";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timerLabels, timerDurations } from "@/config/timer";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Subject } from "@/types/subject";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function PomodoroTimer({
  subjects,
  subjectId,
  onSubjectChange,
}: {
  subjects: Subject[];
  subjectId: string | null;
  onSubjectChange: (id: string | null) => void;
}) {
  const {
    sessionType,
    secondsLeft,
    isRunning,
    completedPomodoros,
    start,
    pause,
    reset,
    skip,
    switchSession,
  } = usePomodoro(subjectId);

  const totalSeconds = timerDurations[sessionType];
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="flex gap-2">
        {(["pomodoro", "short_break", "long_break"] as const).map((type) => (
          <Button
            key={type}
            variant={sessionType === type ? "default" : "outline"}
            size="sm"
            onClick={() => switchSession(type)}
          >
            {timerLabels[type]}
          </Button>
        ))}
      </div>

      <div className="relative flex h-64 w-64 items-center justify-center">
        <svg className="absolute h-full w-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            strokeWidth="8"
            className="stroke-muted"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className={cn(
              "transition-all duration-1000",
              sessionType === "pomodoro" ? "stroke-primary" : "stroke-green-500"
            )}
          />
        </svg>
        <span className="text-5xl font-semibold tabular-nums">
          {formatTime(secondsLeft)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size="lg" onClick={isRunning ? pause : start} className="w-32">
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Start
            </>
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={skip}>
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <Select
        value={subjectId ?? "none"}
        onValueChange={(v) => onSubjectChange(v === "none" ? null : v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="No subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No subject</SelectItem>
          {subjects.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-sm text-muted-foreground">
        {completedPomodoros} focus session{completedPomodoros !== 1 ? "s" : ""} completed today
      </p>
    </div>
  );
}