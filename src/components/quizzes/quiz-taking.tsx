"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { submitQuizAttempt } from "@/lib/actions/quizzes";
import type { QuizQuestion } from "@/types/quiz";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function QuizTaking({ quizId, questions }: { quizId: string; questions: QuizQuestion[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const answeredCount = Object.keys(selected).length;

  function selectOption(optionIndex: number) {
    setSelected((prev) => ({ ...prev, [current.id]: optionIndex }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    const answers = questions.map((q) => ({
      question_id: q.id,
      selected_index: selected[q.id] ?? -1,
    }));
    const result = await submitQuizAttempt(quizId, answers);
    if (result.success) {
      router.push(`/quizzes/${quizId}/results/${result.attemptId}`);
    }
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Progress value={((index + 1) / questions.length) * 100} className="flex-1 mr-4" />
        <span className="text-sm font-medium tabular-nums">{formatTime(elapsed)}</span>
      </div>

      <p className="text-sm text-muted-foreground">
        Question {index + 1} of {questions.length}
      </p>

      <h2 className="text-lg font-medium">{current.question}</h2>

      <div className="flex flex-col gap-2">
        {current.options.map((option, i) => (
          <button
            key={i}
            onClick={() => selectOption(i)}
            className={cn(
              "text-left rounded-lg border px-4 py-3 text-sm transition-colors",
              selected[current.id] === i
                ? "border-primary bg-primary/10"
                : "hover:bg-muted"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
        >
          Previous
        </Button>
        {isLast ? (
          <Button
            disabled={answeredCount < questions.length || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Submitting..." : "Submit quiz"}
          </Button>
        ) : (
          <Button onClick={() => setIndex((i) => i + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
}