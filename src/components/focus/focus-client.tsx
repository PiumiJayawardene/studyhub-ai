"use client";

import { useState } from "react";
import { PomodoroTimer } from "@/components/focus/pomodoro-timer";
import type { Subject } from "@/types/subject";

export function FocusClient({ subjects }: { subjects: Subject[] }) {
  const [subjectId, setSubjectId] = useState<string | null>(null);

  return (
    <PomodoroTimer
      subjects={subjects}
      subjectId={subjectId}
      onSubjectChange={setSubjectId}
    />
  );
}