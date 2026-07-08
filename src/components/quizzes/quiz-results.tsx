import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import type { QuizQuestion, QuizAttempt } from "@/types/quiz";

export function QuizResults({
  attempt,
  questions,
}: {
  attempt: QuizAttempt;
  questions: QuizQuestion[];
}) {
  const percentage = Math.round((attempt.score / attempt.total_questions) * 100);

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="text-center">
        <p className="text-4xl font-bold">{percentage}%</p>
        <p className="text-muted-foreground">
          {attempt.score} out of {attempt.total_questions} correct
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {questions.map((q) => {
          const answer = attempt.answers.find((a) => a.question_id === q.id);
          const isCorrect = answer?.selected_index === q.correct_index;

          return (
            <Card key={q.id}>
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium">{q.question}</p>
                </div>
                <div className="flex flex-col gap-1 ml-7">
                  {q.options.map((option, i) => (
                    <p
                      key={i}
                      className={cn(
                        "text-sm px-2 py-1 rounded",
                        i === q.correct_index && "bg-green-500/10 text-green-700 dark:text-green-400",
                        i === answer?.selected_index && i !== q.correct_index && "bg-destructive/10 text-destructive"
                      )}
                    >
                      {option}
                    </p>
                  ))}
                </div>
                {q.explanation && (
                  <p className="text-xs text-muted-foreground ml-7">{q.explanation}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Link href="/quizzes">
  <Button>
    Back to quizzes
  </Button>
</Link>
    </div>
  );
}